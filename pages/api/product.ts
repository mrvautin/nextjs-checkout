import type { NextApiRequest, NextApiResponse } from 'next';
import { getProduct } from '../../lib/products';

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
        const productPermalink = body.permalink;
        const product = await getProduct(productPermalink);

        res.status(200).json(product);
    } catch (ex) {
        console.log('err', ex);
    }
}
