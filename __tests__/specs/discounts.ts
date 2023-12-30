import { testApiHandler } from 'next-test-api-route-handler';
import checkDiscount from '../../pages/api/discount/checkcode';
import type { PageConfig } from 'next';
import { insertTestData } from '../helper';

beforeEach(async () => {
    await insertTestData();
});

it('Check enabled discount code', async () => {
    const handler: typeof checkDiscount & { config?: PageConfig } =
        checkDiscount;
    await testApiHandler({
        handler,
        test: async ({ fetch }) => {
            const res = await fetch({
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    discountCode: 'ENABLED_CODE',
                }),
            });
            const data = await res.json();

            expect(data.code).toEqual('ENABLED_CODE');
            expect(res.status).toEqual(200);
        },
    });
});

it('Check disabled discount code', async () => {
    const handler: typeof checkDiscount & { config?: PageConfig } =
        checkDiscount;
    await testApiHandler({
        handler,
        test: async ({ fetch }) => {
            const res = await fetch({
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    discountCode: 'DISABLED_CODE',
                }),
            });
            const data = await res.json();

            expect(data).toBe(null);
            expect(res.status).toEqual(200);
        },
    });
});

it('Check expired discount code', async () => {
    const handler: typeof checkDiscount & { config?: PageConfig } =
        checkDiscount;
    await testApiHandler({
        handler,
        test: async ({ fetch }) => {
            const res = await fetch({
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    discountCode: 'EXPIRED_CODE',
                }),
            });
            const data = await res.json();

            expect(data).toBe(null);
            expect(res.status).toEqual(200);
        },
    });
});

it('Check non existent discount code', async () => {
    const handler: typeof checkDiscount & { config?: PageConfig } =
        checkDiscount;
    await testApiHandler({
        handler,
        test: async ({ fetch }) => {
            const res = await fetch({
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    discountCode: 'NO_A_CODE',
                }),
            });
            const data = await res.json();

            expect(data).toBe(null);
            expect(res.status).toEqual(200);
        },
    });
});
