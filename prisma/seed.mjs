import { products } from './products';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    // Remove existing
    await prisma.products.deleteMany({});
    await prisma.images.deleteMany({});

    // Loop and add our products
    for (const product of products) {
        const addedProduct = await prisma.products.create({
            data: {
                name: product.name,
                permalink: product.permalink,
                summary: product.summary,
                description: product.description,
                price: product.price,
                enabled: product.enabled,
            },
        });

        // Add the images to the product
        for (const images of product.images) {
            await prisma.images.create({
                data: {
                    url: images.url,
                    alt: images.attr,
                    order: images.order,
                    productId: addedProduct.id,
                },
            });
        }
    }
}
main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async e => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
