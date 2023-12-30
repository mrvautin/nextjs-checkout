import prisma from '../../../../../lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '../../../auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';

/* DASHBOARD API */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'PUT') {
        res.status(405).send({ message: 'Only PUT requests allowed' });
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

    const images = req.body.images;

    // Update the order
    for (let i = 0; i < images.length; i++) {
        const newOrder = i + 1;
        await prisma.images.update({
            where: {
                id: images[i].id,
            },
            data: {
                order: newOrder,
            },
        });
    }

    // Return response
    res.json('success');
}
