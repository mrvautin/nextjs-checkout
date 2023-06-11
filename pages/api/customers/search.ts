import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../api/auth/[...nextauth]';
import prisma from '../../../lib/prisma';

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
                'This is protected content. You can access this content because you are signed in.',
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
        if (searchParameter === 'customerEmail') {
            filter = {
                email: searchTerm,
            };
        }
        if (searchParameter === 'customerLastName') {
            filter = {
                lastName: searchTerm,
            };
        }

        const data = await prisma.customers.findMany({
            where: filter,
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
