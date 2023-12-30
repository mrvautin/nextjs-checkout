import type { NextApiRequest, NextApiResponse } from 'next';
import { updateProduct } from '../../../lib/products';
import { removeCurrency } from '../../../lib/helpers';
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
    // Fix values
    body.price = removeCurrency(body.price);
    delete body.images;

    // Validate product
    const schemaCheck = validateSchema('saveProduct', body);
    if (schemaCheck.valid === false) {
        return res.status(400).json({
            error: 'Please check inputs',
            detail: schemaCheck.errors,
        });
    }

    const productId = body.id;
    try {
        const payload = Object.assign({}, body);
        delete payload.id;
        await updateProduct(productId, payload);
        res.status(200).json(body);
    } catch (ex) {
        console.log('err', ex);
        res.status(400).json({
            error: 'Cannot save product',
        });
    }
}
