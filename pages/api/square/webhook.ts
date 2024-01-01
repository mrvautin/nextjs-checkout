import type { NextApiRequest, NextApiResponse } from 'next';
import { Client, Environment } from 'square';
import { updateOrder } from '../../../lib/orders';

const client = new Client({
    accessToken: process.env.SQUARE_ACCESS_TOKEN,
    environment: Environment.Sandbox,
});

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Only POST requests allowed' });
        return;
    }

    // Check for Webhook type
    if (req.body.type !== 'payment.updated') {
        res.status(405).send({ message: 'Webhook type not supported' });
        return;
    }

    const squarePaymentId = req.body.data.id;
    const squarePayment = await client.paymentsApi.getPayment(squarePaymentId);
    const squareOrderId = squarePayment.result.payment.orderId;
    const squareOrder = await client.ordersApi.retrieveOrder(squareOrderId);
    const orderId = squareOrder.result.order.referenceId;

    // Create paid indicator
    const approvedStatus = ['COMPLETED', 'COMPLETED'];
    let paidResult = false;
    if (approvedStatus.includes(squarePayment.result.payment.status)) {
        paidResult = true;
    }

    // Update our order with the transaction response
    const order = await updateOrder(orderId, {
        transaction_id: squarePayment.result.payment.id,
        status: squarePayment.result.payment.status,
        paid: paidResult,
    });

    console.log(
        `Square webhook received - Status: ${squarePayment.result.payment.status}, Paid: ${paidResult}`,
    );

    // Update the order with the status of the hook
    await updateOrder(order.id, {
        status: squarePayment.result.payment.status,
        paid: paidResult,
    });

    res.status(200).json({});
}
