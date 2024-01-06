import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15',
});
import { updateOrder } from '../../../lib/orders';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Only GET requests allowed' });
        return;
    }
    const session = await stripe.checkout.sessions.retrieve(
        req.body.session_id,
    );

    // Create paid indicator
    let paidResult = false;
    if (session.status === 'complete') {
        paidResult = true;
    }

    // Update our order with the transaction response
    const order = await updateOrder(session.client_reference_id, {
        transaction_id: session.id,
        status: session.status,
        paid: paidResult,
    });

    const response = {
        id: session.id,
        orderId: order.id,
        transactionId: session.payment_intent,
        status: session.payment_status,
    };

    res.status(200).json(response);
    return;
}
