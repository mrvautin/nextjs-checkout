import type { NextApiRequest, NextApiResponse } from 'next';
import { getCustomer } from '../../lib/customers';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Only POST requests allowed' });
        return;
    }

    // Check session
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
        res.status(404).send({
            content:
                'This is protected content. You can access this content because you are signed in.',
        });
        return;
    }

    const body = req.body;
    try {
        const customerId = body.customerId;
        const customer = await getCustomer(customerId);

        res.status(200).json(customer);
    } catch (ex) {
        console.log('err', ex);
    }
}
