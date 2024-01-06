import React from 'react';
import { NextPage } from 'next';
import Layout from '../../components/Layout';
import Navbar from '../../components/Nav';
import Product from '../../components/Product';
import CheckoutSidebar from '../../components/CheckoutSidebar';

const ProductPage: NextPage = () => {
    return (
        <Layout title="nextjs-checkout | Product">
            <Navbar />
            <Product />
            <CheckoutSidebar />
        </Layout>
    );
};

export default ProductPage;
