/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15',
});
import { createOrder, updateOrder } from '../../../lib/orders';
import { createCustomer } from '../../../lib/customers';

// Define Types
type Customer = {
    id: string;
    email: string;
};

type Order = {
    id: string;
    status: string;
    cart: object;
    totalAmount: number;
    totalUniqueItems: number;
    gateway: string;
    customer: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Only POST requests allowed' });
        return;
    }
    const body = req.body;
    try {
        // Build line items
        const line_items = [];
        const baseUrl = process.env.BASE_URL;
        const currency = process.env.NEXT_PUBLIC_PAYMENT_CURRENCY;
        for (const item of body.cart) {
            line_items.push({
                price_data: {
                    currency: currency,
                    unit_amount: item.price,
                    product_data: {
                        name: item.name,
                    },
                },
                quantity: item.quantity,
            });
        }

        // Create customer
        const customer = (await createCustomer(body.customer)) as Customer;

        // Create the order
        const order = (await createOrder({
            status: 'unpaid',
            cart: body.cart,
            totalAmount: body.totalAmount,
            totalUniqueItems: body.totalUniqueItems,
            gateway: 'stripe',
            customer: customer.id,
        })) as Order;

        // Setup overly complicated Stripe discounts
        const stripeDiscounts = [];
        if (body.meta.discount) {
            const discountPayload = {
                duration: 'once',
            } as any;
            if (body.meta.discount.type === 'percent') {
                discountPayload.percent_off = body.meta.discount.value;
            }
            if (body.meta.discount.type === 'amount') {
                discountPayload.amount_off = body.meta.discount.value;
                discountPayload.currency = currency;
                discountPayload.duration = 'once';
            }
            // Create the once off discount
            // eslint-disable-next-line
            const discount = await stripe.coupons.create(discountPayload);
            stripeDiscounts.push({
                coupon: discount.id,
            });
        }

        // Setup Checkout request
        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: 'payment',
            customer_email: customer.email,
            client_reference_id: order.id,
            discounts: stripeDiscounts,
            success_url: `${baseUrl}/checkout-result?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseUrl}/checkout-result?session_id={CHECKOUT_SESSION_ID}`,
        });

        // Update the order with the checkout reference
        await updateOrder(order.id, {
            checkout_id: session.id,
        });

        // Setup the response
        const response = {
            checkout: {
                url: session.url,
            },
        };

        res.status(200).json(response);
    } catch (ex) {
        console.log('ex', ex);
    }
}
