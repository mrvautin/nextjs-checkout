/* eslint-disable import/no-anonymous-default-export */
import prisma from '../lib/prisma';

export async function getProduct(permalink) {
    try {
        // Default to permalink
        const dbQuery = {
            where: {
                permalink: permalink,
                enabled: true,
            },
            include: {
                images: {
                    orderBy: {
                        order: 'asc',
                    },
                },
            },
        };

        // Select the product record
        const data = await prisma.products.findFirst(dbQuery);

        return data;
    } catch (ex) {
        console.log('err', ex);
        return {};
    }
}

export async function getAdminProduct(productId) {
    try {
        // Default to permalink
        const dbQuery = {
            where: {
                id: productId,
            },
            include: {
                images: {
                    orderBy: {
                        order: 'asc',
                    },
                },
            },
        };

        // Select the product record
        const data = await prisma.products.findFirst(dbQuery);

        return data;
    } catch (ex) {
        console.log('err', ex);
        return {};
    }
}

// When not in admin, return only enabled products
export async function getProducts() {
    try {
        // Select the products
        const data = await prisma.products.findMany({
            where: {
                enabled: true,
            },
            include: {
                images: {
                    orderBy: {
                        order: 'asc',
                    },
                },
            },
        });

        return data;
    } catch (ex) {
        console.log('err', ex);
        return {};
    }
}

// When in admin, return all products
export async function getAdminProducts() {
    try {
        // Select the products
        const data = await prisma.products.findMany({
            include: {
                images: {
                    orderBy: {
                        order: 'asc',
                    },
                },
            },
        });

        return data;
    } catch (ex) {
        console.log('err', ex);
        return {};
    }
}

export async function updateProduct(id, args) {
    try {
        // Update the customers record
        const data = await prisma.products.update({
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
    getProduct,
    getAdminProduct,
    getProducts,
    getAdminProducts,
    updateProduct,
};
