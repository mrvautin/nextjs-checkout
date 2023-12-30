import type { NextApiRequest, NextApiResponse } from 'next';
import { getOrders } from '../../lib/orders';
import { checkApiAuth } from '../../lib/user';

/* AUTHENTICATED API */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'GET') {
        res.status(405).send({ message: 'Only GET requests allowed' });
        return;
    }

    // Check API
    const authCheck = await checkApiAuth(
        req.headers['x-user-id'],
        req.headers['x-api-key'],
    );
    if (authCheck.error === true) {
        res.status(404).send({
            error: authCheck.message,
        });
        return;
    }

    // Get the orders
    try {
        const orders = await getOrders();
        res.status(200).json(orders);
    } catch (ex) {
        console.log('err', ex);
        res.status(400).json({
            error: 'Failed to get orders',
        });
    }
}
