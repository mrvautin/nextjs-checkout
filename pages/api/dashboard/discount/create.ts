import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import { createDiscount, getDiscount } from '../../../../lib/discounts';
import { validateSchema } from '../../../../lib/helpers';

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

    // Validate discount
    const schemaCheck = validateSchema('newDiscount', body);
    if (schemaCheck === false) {
        return res.status(400).json({
            error: 'Please check inputs',
        });
    }

    // Duplicate check
    const duplicateCheck = await getDiscount(body.code);
    if (duplicateCheck !== null) {
        return res.status(400).json({
            error: 'Code already in use',
        });
    }

    try {
        await createDiscount(body);
        res.status(200).json(body);
    } catch (ex) {
        console.log('err', ex);
    }
}
