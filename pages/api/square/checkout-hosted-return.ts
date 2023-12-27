import type { NextApiRequest, NextApiResponse } from 'next';
import { Client, Environment } from 'square';
import { updateOrder } from '../../../lib/orders';

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
        res.status(405).send({ message: 'Only GET requests allowed' });
        return;
    }

    // Extract the data
    const squareOrderId = req.body.orderId;
    const squareOrder = await client.ordersApi.retrieveOrder(squareOrderId);
    const orderId = squareOrder.result.order.referenceId;
    const squarePaymentId = squareOrder.tenders[0].payment_id;
    const squarePayment = await client.paymentsApi.getPayment(squarePaymentId);

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

    const txnResponse = {
        id: squareOrderId,
        orderId: order.id,
        transactionId: squarePaymentId,
        status: squarePayment.result.payment.status,
    };

    res.status(200).json(txnResponse);
}
