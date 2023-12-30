import type { NextApiRequest, NextApiResponse } from 'next';
import { Client, Environment } from 'square';
import { createOrder, updateOrder } from '../../../lib/orders';
import { createCustomer } from '../../../lib/customers';

// Set the Square env
let SquareEnv = Environment.Sandbox;
if (process.env.NODE_ENV === 'production') {
    SquareEnv = Environment.Production;
}

// Setup Square client
const client = new Client({
    accessToken: process.env.SQUARE_ACCESS_TOKEN,
    environment: SquareEnv,
});

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Only POST requests allowed' });
        return;
    }
    const body = req.body;

    // Setup default payload
    const checkoutPayload = {
        checkout_options: {
            redirect_url: `${process.env.BASE_URL}/checkout-result`,
        },
        order: {
            locationId: process.env.SQUARE_LOCATION_ID,
            lineItems: [],
        },
    };

    try {
        // Build line items
        const line_items = [];
        for (const item of body.cart) {
            line_items.push({
                name: item.name,
                quantity: item.quantity.toString(),
                basePriceMoney: {
                    amount: item.price,
                    currency: process.env.NEXT_PUBLIC_PAYMENT_CURRENCY,
                },
            });
        }
        checkoutPayload.order.lineItems = line_items;

        // Create customer
        const customer = await createCustomer(body.customer);

        // Create the order
        const order = await createOrder({
            status: 'unpaid',
            cart: body.cart,
            totalAmount: body.totalAmount,
            totalUniqueItems: body.totalUniqueItems,
            gateway: 'square',
            customer: customer.id,
        });

        checkoutPayload.order.referenceId = order.id;
        checkoutPayload.order.metadata = {
            orderId: order.id,
        };
        checkoutPayload.idempotencyKey = order.id;
        checkoutPayload.prePopulatedData = {
            buyerEmail: customer.email,
        };

        // Call the API to create checkout
        const checkoutResponse = await client.checkoutApi.createPaymentLink(
            checkoutPayload,
        );

        // Update the order with the checkout reference
        await updateOrder(order.id, {
            checkout_id: checkoutResponse.result.paymentLink.orderId,
        });

        // Setup the response
        const response = {
            checkout: {
                url: checkoutResponse.result.paymentLink.url,
            },
        };

        res.status(200).json(response);
    } catch (ex) {
        console.log('err', ex);
        res.status(400).json({
            error: 'Failed to create checkout',
        });
    }
}
