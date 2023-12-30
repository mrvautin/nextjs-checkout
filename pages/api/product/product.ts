import type { NextApiRequest, NextApiResponse } from 'next';
import { getProduct } from '../../../lib/products';

/* PUBLIC API */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Only POST requests allowed' });
        return;
    }
    const body = req.body;
    try {
        const permalink = body.permalink;
        const product = await getProduct(permalink);

        if (!product) {
            return res.status(200).json({});
        }

        res.status(200).json(product);
    } catch (ex) {
        console.log('err', ex);
        res.status(400).json({
            error: 'Failed to get product',
        });
    }
}
