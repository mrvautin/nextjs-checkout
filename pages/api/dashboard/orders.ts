import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../api/auth/[...nextauth]';
import { format } from 'date-fns';
import prisma from '../../../lib/prisma';

/* DASHBOARD API */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'GET') {
        res.status(405).send({ message: 'Only GET requests allowed' });
        return;
    }

    // Check session
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
        res.status(404).send({
            content:
                'This is protected content. You cant access this content because you are not signed in.',
        });
        return;
    }

    try {
        // Setup last 7 days dates
        const data = {};
        const labels = [];
        for (let i = 7; i >= 0; i--) {
            const currDate = new Date();
            currDate.setDate(currDate.getDate() - i);
            labels.push(format(currDate, 'dd/MM'));
            data[format(currDate, 'dd/MM')] = 0;
        }

        // Get last 7 days of data from DB
        const d = new Date();
        d.setDate(d.getDate() - 7);
        const results = await prisma.orders.groupBy({
            by: ['created_at'],
            _count: true,
            _sum: {
                totalAmount: true,
            },
            where: {
                created_at: {
                    gte: d,
                },
            },
        });

        // Collate our results
        results.forEach(row => {
            const resultDate = format(new Date(row.created_at), 'dd/MM');
            if (resultDate in data) {
                const currentCount = data[resultDate];
                data[resultDate] = currentCount + row._count;
            }
        });

        // Return results
        res.status(200).json({
            labels,
            results: data,
        });
    } catch (ex) {
        console.log('err', ex);
        res.status(400).json({
            error: 'Failed to get orders',
        });
    }
}
