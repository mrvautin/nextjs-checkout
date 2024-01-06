import prisma from './prisma';

/* eslint-disable import/no-anonymous-default-export */
export async function createVariant(args) {
    try {
        const dbEntry = {
            title: args.title,
            values: args.values,
            enabled: true,
            productId: args.productId,
        };

        // Insert the variant record
        const data = await prisma.variants.create({
            data: dbEntry,
        });

        return data;
    } catch (ex) {
        console.log('err', ex);
        return {};
    }
}

export async function deleteVariant(id) {
    try {
        // delete the variant record
        const data = await prisma.variants.delete({
            where: { id: id },
        });
        return data;
    } catch (ex) {
        return {
            error: 'Failed to delete variant',
        };
    }
}

export default {
    createVariant,
};
