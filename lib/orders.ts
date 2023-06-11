import prisma from '../lib/prisma';

/* eslint-disable import/no-anonymous-default-export */
export async function createOrder(args) {
    try {
        const dbEntry = {
            status: args.status,
            cart: args.cart,
            totalAmount: args.totalAmount,
            totalUniqueItems: args.totalUniqueItems,
            paid: false,
            gateway: args.gateway,
            customerId: args.customer,
        };

        // Insert the order record
        const data = await prisma.orders.create({
            data: dbEntry,
        });

        return data;
    } catch (ex) {
        console.log('err', ex);
        return {};
    }
}

export async function updateOrder(id, args) {
    try {
        // Update the order record
        const data = await prisma.orders.update({
            where: { id: id },
            data: args,
        });

        return data;
    } catch (ex) {
        console.log('err', ex);
        return {};
    }
}

export async function getOrder(id) {
    try {
        // Select the order record
        const data = await prisma.orders.findFirst({
            where: { id: id },
            include: {
                customer: true,
            },
        });

        return data;
    } catch (ex) {
        console.log('err', ex);
        return {};
    }
}

export async function getOrderByCheckout(checkoutId) {
    try {
        // Select the order record
        const data = await prisma.orders.findFirst({
            where: { checkout_id: checkoutId },
            include: {
                customer: true,
            },
        });

        return data;
    } catch (ex) {
        console.log('err', ex);
        return {};
    }
}

export async function getOrders() {
    try {
        // Select the orders
        const orders = await prisma.orders.findMany({
            include: {
                customer: true,
            },
            take: 20,
            orderBy: {
                created_at: 'desc',
            },
        });
        return orders;
    } catch (ex) {
        console.log('err', ex);
        return {};
    }
}

export default {
    createOrder,
    updateOrder,
    getOrder,
    getOrderByCheckout,
    getOrders,
};
