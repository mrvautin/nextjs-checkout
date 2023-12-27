import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import { createProduct, getProduct } from '../../../../lib/products';
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

    // Validate product
    const schemaCheck = validateSchema('newProduct', body);
    if (schemaCheck === false) {
        return res.status(400).json({
            error: 'Please check inputs',
        });
    }

    // Duplicate check
    const duplicateCheck = await getProduct(body.permalink);
    if (duplicateCheck !== null) {
        return res.status(400).json({
            error: 'Product permalink already in use',
        });
    }

    try {
        await createProduct(body);
        res.status(200).json(body);
    } catch (ex) {
        console.log('err', ex);
    }
}
