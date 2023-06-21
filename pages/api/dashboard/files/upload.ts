import { formidable } from 'formidable';
import { getAdminProduct } from '../../../../lib/products';
import { upload } from '../../../../lib/images';
import prisma from '../../../../lib/prisma';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Only POST requests allowed' });
        return;
    }

    // Parse the file input form
    try {
        const form = formidable({ multiples: false });
        const formfields = await new Promise(function (resolve, reject) {
            form.parse(req, function (err, fields, files) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve({
                    image: files.image[0],
                    productId: fields.productId[0],
                });
            });
        });

        const response = await upload(formfields.image);
        // Check for error
        if (response.error === true) {
            console.log('Error uploading file', response.message);
            return res.status(400).json({
                error: 'Unable to upload file. Please check your config and try again.',
            });
        }

        // Add image to DB
        await prisma.images.create({
            data: {
                url: response.url,
                alt: formfields.image.originalFilename,
                order: 6,
                productId: formfields.productId,
            },
        });

        // Get our updated product
        const product = await getAdminProduct(formfields.productId);

        // Return response
        return res.json(product);
    } catch (ex) {
        console.log('Error uploading file', ex);
        return res.status(400).json({
            error: 'Unable to upload file. Please check your config and try again.',
        });
    }
}
