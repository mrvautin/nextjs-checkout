import type { NextApiRequest, NextApiResponse } from 'next';
import { getProducts } from '../../lib/products';

/* PUBLIC API */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'GET') {
        res.status(405).send({ message: 'Only GET requests allowed' });
        return;
    }
    try {
        const products = await getProducts();

        res.status(200).json(products);
    } catch (ex) {
        console.log('err', ex);
        res.status(400).json({
            error: 'Failed to get products',
        });
    }
}
