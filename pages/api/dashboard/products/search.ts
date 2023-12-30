import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import prisma from '../../../../lib/prisma';

/* DASHBOARD API */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Only POST requests allowed' });
        return;
    }

    // Check session
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
        res.status(404).send({
            content:
                "This is protected content. You can't access this content because you are not signed in.",
        });
        return;
    }

    const body = req.body;
    try {
        // Search the DB
        const searchTerm = body.searchTerm;
        const searchParameter = body.searchParameter;

        // Setup the filter
        let filter = {};
        if (searchParameter === 'id') {
            filter = {
                id: searchTerm,
            };
        }
        if (searchParameter === 'name') {
            filter = {
                name: {
                    contains: searchTerm,
                },
            };
        }

        const data = await prisma.products.findMany({
            where: filter,
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
