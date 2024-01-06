import { apiResolver } from 'next/dist/server/api-utils';
import { createServer } from 'http';
import testData from './testdata';
import supertest from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * @type {import("next").NextApiHandler} handler
 */
export function testClient(handler) {
    const serverRequestListener = async (req, res) => {
        return apiResolver(req, res, undefined, handler, {}, undefined);
    };

    const server = createServer(serverRequestListener);
    return supertest(server);
}

export async function insertTestData() {
    const data = {
        products: [],
        discounts: [],
        users: [],
        customers: [],
        variants: [],
    };

    // Remove existing
    await prisma.variants.deleteMany({});
    await prisma.images.deleteMany({});
    await prisma.products.deleteMany({});
    await prisma.discounts.deleteMany({});
    await prisma.customers.deleteMany({});

    // Loop and add our products
    for (const product of testData.products) {
        await prisma.products.create({
            data: {
                name: product.name,
                permalink: product.permalink,
                summary: product.summary,
                description: product.description,
                price: product.price,
                enabled: product.enabled,
            },
        });
    }

    // Loop and add our users
    for (const user of testData.users) {
        await prisma.users.create({
            data: {
                name: user.name,
                email: user.email,
                apiKey: uuidv4(),
                enabled: user.enabled,
            },
        });
    }

    // Loop and add our discounts
    for (const discount of testData.discounts) {
        await prisma.discounts.create({
            data: {
                name: discount.name,
                code: discount.code,
                type: discount.type,
                value: discount.value,
                start_at: discount.start_at,
                end_at: discount.end_at,
                enabled: discount.enabled,
            },
        });
    }

    // Loop and add our customers
    for (const customer of testData.customers) {
        await prisma.customers.create({
            data: {
                firstName: customer.firstName,
                lastName: customer.lastName,
                email: customer.email,
                phone: customer.phone,
                address1: customer.address1,
                suburb: customer.suburb,
                state: customer.state,
                postcode: customer.postcode,
                country: customer.country,
            },
        });
    }

    // Loop and add our variants
    for (const variant of testData.variants) {
        const product = await prisma.products.findFirst({
            orderBy: {
                created_at: 'desc',
            },
        });
        await prisma.variants.create({
            data: {
                title: variant.title,
                values: variant.values,
                enabled: true,
                productId: product.id,
            },
        });
    }

    // Get data
    data.products = await prisma.products.findMany({
        orderBy: {
            created_at: 'desc',
        },
    });
    data.users = await prisma.users.findMany({
        orderBy: {
            created_at: 'desc',
        },
    });
    data.discounts = await prisma.discounts.findMany({
        orderBy: {
            created_at: 'desc',
        },
    });
    data.customers = await prisma.customers.findMany({
        orderBy: {
            created_at: 'desc',
        },
    });
    data.variants = await prisma.variants.findMany({
        orderBy: {
            created_at: 'desc',
        },
    });
    return data;
}
