import type { NextApiRequest, NextApiResponse } from 'next';
import { getAdminDiscount } from '../../../../lib/discounts';

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
        const discountId = body.id;
        const discount = await getAdminDiscount(discountId);
        if (!discount) {
            return res.status(200).json({});
        }

        res.status(200).json(discount);
    } catch (ex) {
        console.log('err', ex);
    }
}
