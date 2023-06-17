import { products } from './products';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    // Remove existing
    await prisma.products.deleteMany({});

    // Loop and add our products
    for (const product of products) {
        await prisma.products.create({
            data: {
                name: product.name,
                permalink: product.permalink,
                summary: product.summary,
                description: product.description,
                price: product.price,
                images: product.images,
                enabled: product.enabled,
            },
        });
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
