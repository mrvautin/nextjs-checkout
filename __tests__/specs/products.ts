import { testApiHandler } from 'next-test-api-route-handler';
import getProducts from '../../pages/api/products';
import getProduct from '../../pages/api/product';
import createProduct from '../../pages/api/product/create';
import type { PageConfig } from 'next';
import { insertTestData } from '../helper';

let testData;
beforeEach(async () => {
    testData = await insertTestData();
});

it('Get Products', async () => {
    const handler: typeof getProducts & { config?: PageConfig } = getProducts;
    await testApiHandler({
        handler,
        test: async ({ fetch }) => {
            const res = await fetch({ method: 'GET' });
            const data = await res.json();

            // Ensure all returned products are enabled
            for (const product of data) {
                expect(product.enabled).toEqual(true);
            }

            expect(res.status).toEqual(200);
            expect(data.length).toBeGreaterThan(0);
        },
    });
});

it('Get single Product', async () => {
    const handler: typeof getProduct & { config?: PageConfig } = getProduct;
    await testApiHandler({
        handler,
        test: async ({ fetch }) => {
            const product = testData.products[0];
            const res = await fetch({
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    permalink: product.permalink,
                }),
            });
            const data = await res.json();

            expect(data.id).toEqual(product.id);
            expect(data.permalink).toEqual(product.permalink);
            expect(data.name).toEqual(product.name);
            expect(res.status).toEqual(200);
        },
    });
});

it('Create Product', async () => {
    const handler: typeof createProduct & { config?: PageConfig } =
        createProduct;
    await testApiHandler({
        handler,
        test: async ({ fetch }) => {
            const user = testData.users[0];
            const newProduct = {
                name: 'Leather jacket',
                permalink: 'leather-jacket',
                summary: 'A super nice vegan leather jacket',
                description: 'A super nice vegan leather jacket',
                price: 3000,
                enabled: true,
            };

            const res = await fetch({
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'x-user-id': user.id,
                    'x-api-key': user.apiKey,
                },
                body: JSON.stringify(newProduct),
            });
            const data = await res.json();

            expect(data.permalink).toEqual(newProduct.permalink);
            expect(data.name).toEqual(newProduct.name);
            expect(res.status).toEqual(200);
        },
    });
});

it('Create Product with no price', async () => {
    const handler: typeof createProduct & { config?: PageConfig } =
        createProduct;
    await testApiHandler({
        handler,
        test: async ({ fetch }) => {
            const user = testData.users[0];
            const newProduct = {
                name: 'Leather jacket',
                permalink: 'leather-jacket',
                summary: 'A super nice vegan leather jacket',
                description: 'A super nice vegan leather jacket',
                enabled: true,
            };

            const res = await fetch({
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'x-user-id': user.id,
                    'x-api-key': user.apiKey,
                },
                body: JSON.stringify(newProduct),
            });
            const data = await res.json();

            expect(data.error).toEqual('Please check inputs');
            expect(res.status).toEqual(400);
        },
    });
});

it('Create Product with incorrectly formatted price', async () => {
    const handler: typeof createProduct & { config?: PageConfig } =
        createProduct;
    await testApiHandler({
        handler,
        test: async ({ fetch }) => {
            const user = testData.users[0];
            const newProduct = {
                name: 'Leather jacket',
                permalink: 'leather-jacket',
                summary: 'A super nice vegan leather jacket',
                description: 'A super nice vegan leather jacket',
                price: '3000',
                enabled: true,
            };

            const res = await fetch({
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'x-user-id': user.id,
                    'x-api-key': user.apiKey,
                },
                body: JSON.stringify(newProduct),
            });
            const data = await res.json();

            expect(data.error).toEqual('Please check inputs');
            expect(res.status).toEqual(400);
        },
    });
});

it('Create Product with additional propery', async () => {
    const handler: typeof createProduct & { config?: PageConfig } =
        createProduct;
    await testApiHandler({
        handler,
        test: async ({ fetch }) => {
            const user = testData.users[0];
            const newProduct = {
                name: 'Leather jacket',
                permalink: 'leather-jacket',
                summary: 'A super nice vegan leather jacket',
                description: 'A super nice vegan leather jacket',
                price: 3000,
                shouldNotBeHere: 'Failme',
                enabled: true,
            };

            const res = await fetch({
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'x-user-id': user.id,
                    'x-api-key': user.apiKey,
                },
                body: JSON.stringify(newProduct),
            });
            const data = await res.json();

            expect(data.error).toEqual('Please check inputs');
            expect(res.status).toEqual(400);
        },
    });
});
