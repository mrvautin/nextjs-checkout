import type { NextApiRequest, NextApiResponse } from 'next';
import { getCustomers } from '../../lib/customers';
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

    // Get the customers
    try {
        const customers = await getCustomers();
        res.status(200).json(customers);
    } catch (ex) {
        console.log('err', ex);
        res.status(400).json({
            error: 'Failed to get customers',
        });
    }
}
