import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { createOrder, updateOrder } from '../../../lib/orders';
import { createCustomer } from '../../../lib/customers';

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
        amount: 0,
        currency_code: process.env.NEXT_PUBLIC_PAYMENT_CURRENCY,
        entity_id: process.env.VERIFONE_ENTITY_ID,
        configurations: {
            card: {
                payment_contract_id: process.env.VERIFONE_PAYMENT_CONTRACT,
            },
        },
        line_items: [],
        theme_id: process.env.VERIFONE_THEME_ID,
        interaction_type: 'HPP',
        shop_url: `${process.env.BASE_URL}/checkout`,
        return_url: `${process.env.BASE_URL}/checkout-result`,
    };

    try {
        // Setup Checkout request
        checkoutPayload.amount = body.totalAmount;
        checkoutPayload.entity_id = process.env.VERIFONE_ENTITY_ID;
        checkoutPayload.theme_id = process.env.VERIFONE_THEME_ID;
        checkoutPayload.configurations.card.payment_contract_id =
            process.env.VERIFONE_PAYMENT_CONTRACT;

        // Build line items
        const line_items = [];
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        for (const item of body.cart) {
            line_items.push({
                name: item.name,
                quantity: item.quantity,
                unit_price: item.price,
                total_amount: item.itemTotal,
                image_url: `${baseUrl}${item.images[0].url}`,
            });
        }
        checkoutPayload.line_items = line_items;

        // Create customer
        const customer = await createCustomer(body.customer);

        // Create the order
        const order = await createOrder({
            status: 'unpaid',
            cart: body.cart,
            totalAmount: body.totalAmount,
            totalUniqueItems: body.totalUniqueItems,
            gateway: 'verifone',
            customer: customer.id,
        });

        checkoutPayload.merchant_reference = order.id;

        // Call the API to create checkout
        const checkoutEndpoint = `${process.env.VERIFONE_API_ENDPOINT}/oidc/checkout-service/v2/checkout`;
        const checkoutRequest = axios.create({
            auth: {
                username: process.env.VERIFONE_USER_UID,
                password: process.env.VERIFONE_PUBLIC_KEY,
            },
        });
        const checkoutResponse = await checkoutRequest.post(
            checkoutEndpoint,
            checkoutPayload,
        );

        // Update the order with the checkout reference
        await updateOrder(order.id, {
            checkout_id: checkoutResponse.data.id,
        });

        // Setup the response
        const response = {
            checkout: checkoutResponse.data,
        };

        res.status(200).json(response);
    } catch (ex) {
        console.log('err', ex.response.data);
    }
}
