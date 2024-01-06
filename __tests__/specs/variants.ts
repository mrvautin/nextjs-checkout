import { testApiHandler } from 'next-test-api-route-handler';
import createVariant from '../../pages/api/variants/save';
import deleteVariant from '../../pages/api/variants/delete';
import type { PageConfig } from 'next';
import { insertTestData } from '../helper';

let testData;
beforeEach(async () => {
    testData = await insertTestData();
});

it('Create variant', async () => {
    const handler: typeof createVariant & { config?: PageConfig } =
        createVariant;
    await testApiHandler({
        handler,
        test: async ({ fetch }) => {
            const user = testData.users[0];
            const product = testData.products[0];

            const newVariant = {
                title: 'Size',
                values: 'S,M,L',
                productId: product.id,
                enabled: true,
            };

            const res = await fetch({
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'x-user-id': user.id,
                    'x-api-key': user.apiKey,
                },
                body: JSON.stringify(newVariant),
            });
            const data = await res.json();

            expect(res.status).toEqual(200);
            expect(data.productId).toEqual(product.id);
            expect(data.title).toEqual(newVariant.title);
            expect(data.values).toEqual(newVariant.values);
        },
    });
});

it('Delete variant', async () => {
    const handler: typeof deleteVariant & { config?: PageConfig } =
        deleteVariant;
    await testApiHandler({
        handler,
        test: async ({ fetch }) => {
            const user = testData.users[0];
            const variant = testData.variants[0];

            const res = await fetch({
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'x-user-id': user.id,
                    'x-api-key': user.apiKey,
                },
                body: JSON.stringify({
                    id: variant.id,
                }),
            });
            const data = await res.json();

            expect(data.message).toEqual('Variant deleted');
            expect(res.status).toEqual(200);
        },
    });
});

it('Delete variant - Invalid ID', async () => {
    const handler: typeof deleteVariant & { config?: PageConfig } =
        deleteVariant;
    await testApiHandler({
        handler,
        test: async ({ fetch }) => {
            const user = testData.users[0];

            const res = await fetch({
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'x-user-id': user.id,
                    'x-api-key': user.apiKey,
                },
                body: JSON.stringify({
                    id: 'wrong-id',
                }),
            });
            const data = await res.json();

            expect(data.error).toEqual('Failed to delete variant');
            expect(res.status).toEqual(400);
        },
    });
});
