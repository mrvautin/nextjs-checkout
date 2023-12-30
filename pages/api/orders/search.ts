import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { checkApiAuth } from '../../../lib/user';

/* DASHBOARD API */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Only POST requests allowed' });
        return;
    }

    // Check API
    const authCheck = await checkApiAuth(
        req.headers['x-user-id'],
        req.headers['x-api-key'],
    );
    if (authCheck.error === true) {
        res.status(404).send({
            error: authCheck.message,
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
                customer: {
                    email: searchTerm,
                },
            };
        }
        if (searchParameter === 'customerLastName') {
            filter = {
                customer: {
                    lastName: searchTerm,
                },
            };
        }
        if (searchParameter === 'result') {
            filter = {
                result: searchTerm,
            };
        }

        const data = await prisma.orders.findMany({
            where: filter,
            include: {
                customer: true,
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
            error: 'Failed to search for customer',
        });
    }
}
