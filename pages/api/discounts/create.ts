import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '../../../lib/prisma';

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
    const dbEntry = {
        name: body.name,
        code: body.code,
        type: body.type,
        value: body.value,
        enabled: body.enabled,
        start_at: body.start_at,
        end_at: body.end_at,
    };

    try {
        const results = await prisma.discounts.create({
            data: dbEntry,
        });

        res.status(200).json(results);
    } catch (ex) {
        console.log('err', ex);
    }
}
