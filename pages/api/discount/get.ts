import type { NextApiRequest, NextApiResponse } from 'next';
import { getAdminDiscount } from '../../../lib/discounts';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../api/auth/[...nextauth]';

/* DASHBOARD API */
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
                "This is protected content. You can't access this content because you are not signed in.",
        });
        return;
    }

    const body = req.body;
    try {
        const discountId = body.id;
        const discount = await getAdminDiscount(discountId);
        if (!discount) {
            return res.status(200).json({});
        }

        res.status(200).json(discount);
    } catch (ex) {
        console.log('err', ex);
        res.status(400).json({
            error: 'Failed to get discount',
        });
    }
}
