import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { getOrderByCheckout, updateOrder } from '../../../lib/orders';

async function getCheckout(checkoutId) {
    // Call the API to get checkout
    const checkoutEndpoint = `${process.env.VERIFONE_API_ENDPOINT}/oidc/checkout-service/v2/checkout/${checkoutId}`;
    const checkoutRequest = axios.create({
        auth: {
            username: process.env.VERIFONE_USER_UID,
            password: process.env.VERIFONE_PUBLIC_KEY,
        },
    });
    const checkoutResponse = await checkoutRequest.get(checkoutEndpoint);
    return checkoutResponse.data;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Only POST requests allowed' });
        return;
    }

    // Get Checkout ID
    const checkoutId = req.body.itemId;

    // Get order
    const order = await getOrderByCheckout(checkoutId);

    // Check order is found
    if (!order) {
        return res
            .status(400)
            .json({ error: `Order not found: ${checkoutId}` });
    }

    // Setup status from hook
    let status = '';
    let paid;
    if (req.body.eventType === 'CheckoutTransactionSuccess') {
        status = 'COMPLETED';
        paid = true;
    } else {
        status = 'FAILED';
        paid = false;
    }

    // Get the checkout to validate
    const validateCheckout = await getCheckout(checkoutId);

    /*
        If the values of the checkout don't match the DB, we 
        override the `status` and `paid` values with a validation
        error and update the DB
    */

    // Validate the merchant_reference to order.id
    if (validateCheckout.merchant_reference !== order.id) {
        console.log('didnt validate merchant_reference');
        status = 'FAILED VALIDATION';
        paid = false;
    }

    // Validate the amount to order.amount
    if (validateCheckout.amount !== order.totalAmount) {
        console.log('didnt validate amount');
        status = 'FAILED VALIDATION';
        paid = false;
    }

    console.log(`Checkout received - Status: ${status}, Paid: ${paid}`);

    // Update the order with the status of the hook
    await updateOrder(order.id, {
        status,
        paid,
    });

    res.status(200).json({});
}
