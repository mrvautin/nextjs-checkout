import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import React from 'react';
import Layout from '../../components/Layout';
import NavAdmin from '../../components/NavAdmin';
import Discount from '../../components/DiscountAdmin';
import Spinner from '../../components/Spinner';

const DiscountNew: NextPage = () => {
    // Check for user session
    const { status } = useSession({
        required: true,
        onUnauthenticated() {
            window.location.href = '/api/auth/signin';
        },
    });

    if (status === 'loading') {
        return <Spinner loading={true} />;
    }

    return (
        <Layout title="nextjs-checkout | Discount">
            <NavAdmin />
            <h2>Discount</h2>
            <Discount type="new" />
        </Layout>
    );
};

export default DiscountNew;
