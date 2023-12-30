import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

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
    if (req.body.searchTerm.trim() === '') {
        res.status(400).json({
            error: 'Please enter a search term',
        });
    }
    try {
        // Search the DB
        const searchTerm = body.searchTerm.replace(/[\s\n\t]/g, '_');
        const data = await prisma.products.findMany({
            where: {
                OR: [
                    {
                        name: {
                            search: searchTerm,
                        },
                    },
                    {
                        description: {
                            search: searchTerm,
                        },
                    },
                ],
            },
            include: {
                images: {
                    orderBy: {
                        order: 'asc',
                    },
                },
            },
        });
        // Setup the results
        let results = [];
        if (data.length > 0) {
            results = data;
        }

        res.status(200).json(results);
    } catch (ex) {
        console.log('err', ex);
        res.status(400).json({
            error: 'Failed to search for product',
        });
    }
}
