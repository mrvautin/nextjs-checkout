/* eslint-disable import/no-anonymous-default-export */
import prisma from '../lib/prisma';

export async function getProduct(permalink) {
    try {
        // Select the product record
        const data = await prisma.products.findFirst({
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
                variants: {
                    orderBy: {
                        created_at: 'asc',
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

export async function getAdminProduct(productId) {
    try {
        // Select the product record
        const data = await prisma.products.findFirst({
            where: {
                id: productId,
            },
            include: {
                images: {
                    orderBy: {
                        order: 'asc',
                    },
                },
                variants: {
                    orderBy: {
                        created_at: 'asc',
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
                variants: {
                    orderBy: {
                        created_at: 'asc',
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
                variants: {
                    orderBy: {
                        created_at: 'asc',
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

export async function createProduct(args) {
    try {
        // Update the product record
        const data = await prisma.products.create({
            data: {
                name: args.name,
                permalink: args.permalink,
                summary: args.summary,
                description: args.description,
                price: args.price,
                images: args.images,
                enabled: args.enabled,
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
        // Update the product record
        const data = await prisma.products.update({
            where: { id: id },
            data: {
                name: args.name,
                permalink: args.permalink,
                summary: args.summary,
                description: args.description,
                price: args.price,
                enabled: args.enabled,
            },
        });

        return data;
    } catch (ex) {
        console.log('err', ex);
        return {};
    }
}

export async function deleteProduct(id) {
    try {
        // delete the product record
        const data = await prisma.products.delete({
            where: { id: id },
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
    createProduct,
    updateProduct,
    deleteProduct,
};
