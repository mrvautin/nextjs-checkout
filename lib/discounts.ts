/* eslint-disable import/no-anonymous-default-export */
import prisma from './prisma';

export async function getDiscount(discountCode) {
    try {
        // Default to permalink
        const dbQuery = {
            where: {
                code: discountCode,
                enabled: true,
            },
        };

        // Select the discount record
        const data = await prisma.discounts.findFirst(dbQuery);

        return data;
    } catch (ex) {
        console.log('err', ex);
        return {};
    }
}

export async function getAdminDiscount(discountId) {
    try {
        const dbQuery = {
            where: {
                id: discountId,
            },
        };

        // Select the product record
        const data = await prisma.discounts.findFirst(dbQuery);

        return data;
    } catch (ex) {
        console.log('err', ex);
        return {};
    }
}

// When in admin, return all discounts
export async function getAdminDiscounts() {
    try {
        // Select the products
        const data = await prisma.discounts.findMany({});

        return data;
    } catch (ex) {
        console.log('err', ex);
        return {};
    }
}

export async function updateDiscount(id, args) {
    try {
        // Update the discount record
        const data = await prisma.discounts.update({
            where: { id: id },
            data: args,
        });

        return data;
    } catch (ex) {
        console.log('err', ex);
        return {};
    }
}

export default {
    getDiscount,
    getAdminDiscounts,
    updateDiscount,
};
