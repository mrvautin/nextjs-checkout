/* eslint-disable import/no-anonymous-default-export */
import prisma from '../lib/prisma';

export async function getProduct(permalink) {
    try {
        // Select the product record
        const data = await prisma.products.findFirst({
            where: {
                permalink: permalink,
            },
        });

        return data;
    } catch (ex) {
        console.log('err', ex);
        return {};
    }
}

export async function getProducts() {
    try {
        // Select the products
        const data = await prisma.products.findMany();

        return data;
    } catch (ex) {
        console.log('err', ex);
        return {};
    }
}

export default {
    getProduct,
    getProducts,
};
