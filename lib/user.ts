import prisma from './prisma';

export async function createUser(args) {
    try {
        // Update the customers record
        const data = await prisma.users.create({
            data: args,
        });

        return data;
    } catch (ex) {
        console.log('err', ex);
        return {};
    }
}

export async function updateUser(id, args) {
    try {
        // Update the customers record
        const data = await prisma.users.update({
            where: { id: id },
            data: args,
        });
        return data;
    } catch (ex) {
        console.log('err', ex);
        return {};
    }
}

export async function getUserById(id) {
    try {
        // Select the customer record
        const data = await prisma.users.findFirst({
            where: { id: id },
        });

        return data;
    } catch (ex) {
        console.log('err', ex);
        return {};
    }
}

export async function getUserByEmail(email) {
    try {
        // Select the customer record
        const data = await prisma.users.findFirst({
            where: { email: email },
        });

        return data;
    } catch (ex) {
        console.log('err', ex);
        return {};
    }
}

export async function checkApiAuth(userId, apiKey) {
    if (!userId) {
        return {
            error: true,
            message: 'User not authorised',
        };
    }
    if (!apiKey) {
        return {
            error: true,
            message: 'User not authorised',
        };
    }

    return {
        error: false,
    };
}
