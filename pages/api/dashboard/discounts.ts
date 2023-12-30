import type { NextApiRequest, NextApiResponse } from 'next';
import { getAdminDiscounts } from '../../../lib/discounts';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../api/auth/[...nextauth]';

/* DASHBOARD API */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'GET') {
        res.status(405).send({ message: 'Only GET requests allowed' });
        return;
    }

    // Check session
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
        res.status(404).send({
            content:
                'This is protected content. You cant access this content because you are not signed in.',
        });
        return;
    }

    try {
        const discounts = await getAdminDiscounts();

        res.status(200).json(discounts);
    } catch (ex) {
        console.log('err', ex);
        res.status(400).json({
            error: 'Failed to get discounts',
        });
    }
}
