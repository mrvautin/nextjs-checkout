import type { NextApiRequest, NextApiResponse } from 'next';
import { createProduct, getProduct } from '../../../lib/products';
import { validateSchema } from '../../../lib/helpers';
import { checkApiAuth } from '../../../lib/user';

/* AUTHENTICATED API */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Only POST requests allowed' });
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

    // Validate product
    const schemaCheck = validateSchema('newProduct', body);
    if (schemaCheck.valid === false) {
        return res.status(400).json({
            error: 'Please check inputs',
            detail: schemaCheck.errors,
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
        res.status(400).json({
            error: 'Failed to create product',
        });
    }
}
