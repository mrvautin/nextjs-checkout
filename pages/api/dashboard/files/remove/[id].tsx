import { remove } from '../../../../../lib/images';
import { getAdminProduct } from '../../../../../lib/products';
import prisma from '../../../../../lib/prisma';
import { authOptions } from '../../../auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (req.method !== 'DELETE') {
        res.status(405).send({ message: 'Only DELETE requests allowed' });
        return;
    }

    // Check session
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
        res.status(404).send({
            content:
                "This is protected content. You can't access this content because you are signed in.",
        });
        return;
    }

    try {
        const image = await prisma.images.findFirst({
            where: {
                id: req.query.id,
            },
        });
        if (!image) {
            return res.status(400).send({ message: 'Cannot locate file' });
        }

        console.log('image', image);
        console.log('req.query.id', req.query.id);

        // Remove image
        await remove(image.filename);

        // Remove image from DB
        await prisma.images.delete({
            where: {
                id: image.id,
            },
        });

        // Get our updated product
        const product = await getAdminProduct(image.productId);
        console.log('product', product);

        // Return response
        return res.json(product);
    } catch (ex) {
        console.log('Error uploading file', ex);
        return res.status(400).json({
            error: 'Unable to upload file. Please check your config and try again.',
        });
    }
}
