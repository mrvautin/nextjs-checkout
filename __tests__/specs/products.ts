import { testApiHandler } from 'next-test-api-route-handler';
import getProducts from '../../pages/api/products';
import getProduct from '../../pages/api/product';
import type { PageConfig } from 'next';
import _ from 'lodash';
import testData from '../testdata';

it('Get Products', async () => {
    const handler: typeof getProducts & { config?: PageConfig } = getProducts;
    await testApiHandler({
        handler,
        test: async ({ fetch }) => {
            const res = await fetch({ method: 'GET' });
            const data = await res.json();

            const product = _.find(data, {
                permalink: testData.products[0].permalink,
            });
            expect(data[0].permalink).toEqual(product.permalink);
            expect(data[0].name).toEqual(product.name);
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
                body: JSON.stringify({
                    permalink: product.permalink,
                }),
            });
            const data = await res.json();

            expect(data.permalink).toEqual(product.permalink);
            expect(data.name).toEqual(product.name);
            expect(res.status).toEqual(200);
        },
    });
});
