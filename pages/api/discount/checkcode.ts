import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

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
        // Check code
        const discountCode = body.discountCode;
        if (!discountCode || discountCode === '') {
            return res.status(400).json({
                error: 'Discount not found',
            });
        }

        const discount = await prisma.discounts.findFirst({
            where: {
                code: discountCode,
                enabled: true,
                AND: [
                    {
                        start_at: {
                            lte: new Date(),
                        },
                    },
                    {
                        end_at: {
                            gte: new Date(),
                        },
                    },
                ],
            },
        });
        res.status(200).json(discount);
    } catch (ex) {
        console.log('err', ex);
        res.status(400).json({
            error: 'Discount not found',
        });
    }
}
