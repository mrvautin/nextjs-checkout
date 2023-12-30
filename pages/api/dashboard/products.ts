import type { NextApiRequest, NextApiResponse } from 'next';
import { getAdminProducts } from '../../../lib/products';
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
                "This is protected content. You can't access this content because you are not signed in.",
        });
        return;
    }

    try {
        const products = await getAdminProducts();

        res.status(200).json(products);
    } catch (ex) {
        console.log('err', ex);
        res.status(400).json({
            error: 'Failed to get products',
        });
    }
}
