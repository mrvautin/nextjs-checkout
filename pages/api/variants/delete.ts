import type { NextApiRequest, NextApiResponse } from 'next';
import { deleteVariant } from '../../../lib/variants';
import { checkApiAuth } from '../../../lib/user';

/* AUTHENTICATED API */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Only DELETE requests allowed' });
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

    try {
        const response = await deleteVariant(body.id);
        if (response.error) {
            return res.status(400).json({
                error: response.error,
            });
        }
        return res.status(200).json({
            message: 'Variant deleted',
        });
    } catch (ex) {
        res.status(400).json({
            error: 'Failed to delete',
        });
    }
}
