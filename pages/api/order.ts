import type { NextApiRequest, NextApiResponse } from 'next';
import { getOrder } from '../../lib/orders';

/* PUBLIC API */
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
        const orderId = body.orderId;
        const order = await getOrder(orderId);

        res.status(200).json(order);
    } catch (ex) {
        console.log('err', ex);
        res.status(400).json({
            error: 'Failed to get order',
        });
    }
}
