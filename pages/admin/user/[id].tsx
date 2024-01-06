import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import NavAdmin from '../../../components/NavAdmin';
import User from '../../../components/UserForm';
import Spinner from '../../../components/Spinner';

const UserPage: NextPage = () => {
    const router = useRouter();
    useEffect(() => {
        if (!router.isReady) {
            return;
        }
    }, [router.isReady]);

    // Check for user session
    const { status, data: session } = useSession({
        required: true,
        onUnauthenticated() {
            window.location.href = '/api/auth/signin';
        },
    });

    if (status === 'loading') {
        return <Spinner loading={true} />;
    }

    return (
        <Layout title="nextjs-checkout | User">
            <NavAdmin />
            <h2>User</h2>
            <User user={session.user} />
        </Layout>
    );
};

export default UserPage;
