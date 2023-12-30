import type { NextApiRequest, NextApiResponse } from 'next';
import { updateCustomer } from '../../../lib/customers';
import { checkApiAuth } from '../../../lib/user';

/* AUTHENTICATED API */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Only POST requests allowed' });
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

    const body = req.body;
    const customerId = body.id;
    try {
        const payload = body;
        delete payload.id;
        const customer = await updateCustomer(customerId, payload);
        res.status(200).json(customer);
    } catch (ex) {
        console.log('err', ex);
        res.status(400).json({
            error: 'Failed to save customer',
        });
    }
}
