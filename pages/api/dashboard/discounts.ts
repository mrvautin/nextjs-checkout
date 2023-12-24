import type { NextApiRequest, NextApiResponse } from 'next';
import { getAdminDiscounts } from '../../../lib/discounts';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'GET') {
        res.status(405).send({ message: 'Only GET requests allowed' });
        return;
    }
    try {
        const discounts = await getAdminDiscounts();

        res.status(200).json(discounts);
    } catch (ex) {
        console.log('err', ex);
    }
}
