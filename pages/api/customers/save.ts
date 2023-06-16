import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../api/auth/[...nextauth]';
import { updateCustomer } from '../../../lib/customers';

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
                "This is protected content. You can't access this content because you are signed in.",
        });
        return;
    }

    const body = req.body;
    const customerId = body.id;
    try {
        const payload = body;
        delete payload.id;
        await updateCustomer(customerId, payload);
        res.status(200).json(body);
    } catch (ex) {
        console.log('err', ex);
    }
}
