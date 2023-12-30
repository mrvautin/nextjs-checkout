import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { updateUser } from '../../../lib/user';

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
        const user = await updateUser(body.id, {
            apiKey: body.apiKey,
        });
        res.status(200).json(user);
    } catch (ex) {
        console.log('err', ex);
        res.status(400).json({
            error: 'Failed to update user',
        });
    }
}
