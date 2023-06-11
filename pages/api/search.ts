import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

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
        // Search the DB
        const searchTerm = body.searchTerm;
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
        });
        // Setup the results
        let results = [];
        if (data.length > 0) {
            results = data;
        }

        res.status(200).json(results);
    } catch (ex) {
        console.log('err', ex);
    }
}
