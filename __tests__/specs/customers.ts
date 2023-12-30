import { testApiHandler } from 'next-test-api-route-handler';
import getCustomer from '../../pages/api/customer';
import getCustomers from '../../pages/api/customers';
import createCustomer from '../../pages/api/customers/create';
import updateCustomer from '../../pages/api/customers/save';
import type { PageConfig } from 'next';
import { insertTestData } from '../helper';

let testData;
beforeEach(async () => {
    testData = await insertTestData();
});

it('Get Customers', async () => {
    const handler: typeof getCustomers & { config?: PageConfig } = getCustomers;
    await testApiHandler({
        handler,
        test: async ({ fetch }) => {
            const user = testData.users[0];
            const res = await fetch({
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                    'x-user-id': user.id,
                    'x-api-key': user.apiKey,
                },
            });
            const data = await res.json();

            expect(data.length).toBeGreaterThan(0);
        },
    });
});

it('Get Customer by ID', async () => {
    const handler: typeof getCustomer & { config?: PageConfig } = getCustomer;
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
                    customerId: testData.customers[0].id,
                }),
            });
            const data = await res.json();

            expect(data.id).toEqual(testData.customers[0].id);
            expect(data.firstName).toEqual(testData.customers[0].firstName);
            expect(data.email).toEqual(testData.customers[0].email);
        },
    });
});

it('Create a customer', async () => {
    const handler: typeof createCustomer & { config?: PageConfig } =
        createCustomer;
    await testApiHandler({
        handler,
        test: async ({ fetch }) => {
            const user = testData.users[0];
            const newCustomer = {
                firstName: 'Gary',
                lastName: 'Lyon',
                email: 'garylyon@gmail.com',
                phone: '0400000000',
                address1: '1 Test Street',
                suburb: 'Testvile',
                state: 'SA',
                postcode: '5000',
                country: 'Australia',
            };

            const res = await fetch({
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'x-user-id': user.id,
                    'x-api-key': user.apiKey,
                },
                body: JSON.stringify(newCustomer),
            });
            const data = await res.json();

            expect(data).toHaveProperty('id');
            expect(data.firstName).toEqual(newCustomer.firstName);
            expect(data.lastName).toEqual(newCustomer.lastName);
            expect(res.status).toEqual(200);
        },
    });
});

it('Update a customer', async () => {
    const handler: typeof updateCustomer & { config?: PageConfig } =
        updateCustomer;
    await testApiHandler({
        handler,
        test: async ({ fetch }) => {
            const user = testData.users[0];
            const updatedCustomer = {
                id: testData.customers[0].id,
                firstName: 'Gary',
                lastName: 'Gotmarried',
                email: 'garynewname@gmail.com',
                phone: '0400000000',
                address1: '1 Test Street',
                suburb: 'Testvile',
                state: 'SA',
                postcode: '5000',
                country: 'Australia',
            };

            const res = await fetch({
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'x-user-id': user.id,
                    'x-api-key': user.apiKey,
                },
                body: JSON.stringify(updatedCustomer),
            });
            const data = await res.json();

            expect(data.id).toEqual(updatedCustomer.id);
            expect(data.firstName).toEqual(updatedCustomer.firstName);
            expect(data.lastName).toEqual(updatedCustomer.lastName);
            expect(res.status).toEqual(200);
        },
    });
});
