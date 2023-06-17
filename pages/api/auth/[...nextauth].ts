import NextAuth, { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import prisma from '../../../lib/prisma';

export const authOptions: NextAuthOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
    ],
    callbacks: {
        async jwt({ token, account }) {
            // Persist the OAuth access_token to the token right after signin
            if (account) {
                token.accessToken = account.access_token;
            }
            return token;
        },
        async session({ session }) {
            return session;
        },
        async signIn({ user }) {
            // Check how many current users
            const userCount = await prisma.users.count();

            // If not users, create first user
            if (userCount === 0) {
                await prisma.users.create({
                    data: {
                        name: user.name,
                        email: user.email,
                        enabled: true,
                    },
                });
                return true;
            }

            // Check user account
            const userAccount = await prisma.users.findFirst({
                where: {
                    email: user.email,
                    enabled: true,
                },
            });

            if (!userAccount) {
                return false;
            }
            return true;
        },
    },
};

export default NextAuth(authOptions);
