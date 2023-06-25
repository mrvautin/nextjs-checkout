import { products } from './products';
import { createReadStream, statSync } from 'fs';
import { lookup } from 'mime-types';
import {
    DeleteObjectCommand,
    ListObjectsV2Command,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    // Remove any old images from S3
    await removeImages();

    // Remove images from DB
    await prisma.images.deleteMany({});

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
        for (const image of product.images) {
            // Upload image
            const { url, filename } = await uploadImage(image);

            // Add to DB
            await prisma.images.create({
                data: {
                    url: url,
                    alt: image.attr,
                    filename: filename,
                    order: image.order,
                    productId: addedProduct.id,
                },
            });
        }
    }
    console.log('Seed complete!!');
}

const uploadImage = async image => {
    try {
        console.log('Uploading image...');
        const fileExt = (/[^./\\]*$/.exec(image.url) || [''])[0];
        const s3Client = new S3Client({});
        const s3Bucket = process.env.AWS_S3_BUCKET_NAME;
        const fileUUID = uuidv4();
        const fileName = `${fileUUID}.${fileExt}`;
        const fileSize = await statSync(image.url).size;

        // Upload the file
        const uploadCommand = new PutObjectCommand({
            Bucket: s3Bucket,
            Key: fileName,
            Body: createReadStream(image.url),
            ACL: 'public-read',
            ContentType: lookup(image.url),
            ContentLength: fileSize,
        });
        await s3Client.send(uploadCommand);
        return {
            url: `https://${s3Bucket}.s3.amazonaws.com/${fileName}`,
            filename: fileName,
        };
    } catch (ex) {
        console.log('ex', ex);
    }
};

const removeImages = async () => {
    try {
        console.log('Removing old images...');
        const s3Client = new S3Client({});
        const s3Bucket = process.env.AWS_S3_BUCKET_NAME;

        // Get a file list
        const listCommand = new ListObjectsV2Command({
            Bucket: s3Bucket, // the bucket
        });
        const list = await s3Client.send(listCommand);

        // Delete files
        for (const file of list.Contents) {
            // Remove the file from S3
            const removeCommand = new DeleteObjectCommand({
                Bucket: s3Bucket,
                Key: file.Key,
            });
            await s3Client.send(removeCommand);
        }
    } catch (ex) {
        return {
            message: 'Unable to delete file',
        };
    }
};

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async e => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
