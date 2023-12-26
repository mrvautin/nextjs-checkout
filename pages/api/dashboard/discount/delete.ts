import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import { deleteDiscount } from '../../../../lib/discounts';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Only DELETE requests allowed' });
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

    try {
        await deleteDiscount(body.id);
        res.status(200).json({});
    } catch (ex) {
        console.log('err', ex);
        res.status(400).json({
            error: 'Failed to delete',
        });
    }
}
