import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import React from 'react';
import Layout from '../../components/Layout';
import NavAdmin from '../../components/NavAdmin';
import Product from '../../components/ProductAdmin';
import Spinner from '../../components/Spinner';

const ProductNew: NextPage = () => {
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
        <Layout title="nextjs-checkout | Product">
            <NavAdmin />
            <h2>Product</h2>
            <Product type="new" />
        </Layout>
    );
};

export default ProductNew;
