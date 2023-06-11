import prisma from './prisma';

/* eslint-disable import/no-anonymous-default-export */
export async function createCustomer(args) {
    try {
        const dbEntry = {
            email: args.email,
            phone: args.phone,
            firstName: args.firstName,
            lastName: args.lastName,
            address1: args.address1,
            suburb: args.suburb,
            state: args.state,
            postcode: args.postcode,
            country: args.country,
        };

        // Check for existing customer
        const customer = await prisma.customers.findFirst({
            where: { email: args.email },
        });

        // If customer with that email exists, return that customer
        if (customer) {
            return customer;
        }

        // Insert the order record
        const data = await prisma.customers.create({
            data: dbEntry,
        });

        return data;
    } catch (ex) {
        console.log('err', ex);
        return {};
    }
}

export async function updateCustomer(id, args) {
    try {
        // Update the customers record
        const data = await prisma.customers.update({
            where: { id: id },
            data: args,
        });

        return data;
    } catch (ex) {
        console.log('err', ex);
        return {};
    }
}

export async function getCustomer(id) {
    try {
        // Select the customer record
        const data = await prisma.customers.findFirst({
            where: { id: id },
        });

        return data;
    } catch (ex) {
        console.log('err', ex);
        return {};
    }
}

export async function getCustomers() {
    try {
        // Select the customers
        const data = await prisma.customers.findMany({
            take: 20,
            orderBy: {
                created_at: 'desc',
            },
        });
        return data;
    } catch (ex) {
        console.log('err', ex);
        return {};
    }
}

export default {
    createCustomer,
    updateCustomer,
    getCustomer,
    getCustomers,
};
