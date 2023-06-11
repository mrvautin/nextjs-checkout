import type { NextApiRequest, NextApiResponse } from 'next';
import { updateOrder } from '../../../lib/orders';
import axios from 'axios';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Only GET requests allowed' });
        return;
    }
    const checkoutId = req.body.checkout_id;

    // Validate the checkout
    const endpoint = `${process.env.VERIFONE_API_ENDPOINT}/oidc/checkout-service/v2/checkout/${checkoutId}`;
    const request = axios.create({
        auth: {
            username: process.env.VERIFONE_USER_UID,
            password: process.env.VERIFONE_PUBLIC_KEY,
        },
    });
    const response = await request.get(endpoint);

    // Create paid indicator
    let paidResult = false;
    if (response.data.status === 'COMPLETED') {
        paidResult = true;
    }

    // Update our order with the transaction response
    const order = await updateOrder(response.data.merchant_reference, {
        transaction_id: response.data.transaction_id,
        status: response.data.status,
        paid: paidResult,
    });

    if (order.id !== response.data.merchant_reference) {
        console.log('Checkout ID differs');
    }

    const txnResponse = {
        id: response.data.id,
        orderId: order.id,
        transactionId: response.data.transaction_id,
        status: response.data.status,
    };

    res.status(200).json(txnResponse);
}
