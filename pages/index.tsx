import React from 'react';
import { NextPage } from 'next';
import Layout from '../components/Layout';
import Products from '../components/Products';
import Navbar from '../components/Nav';
import CheckoutSidebar from '../components/CheckoutSidebar';

const IndexPage: NextPage = () => {
    return (
        <Layout title="nextjs-checkout | Shop">
            <Navbar />
            <h2>Shop</h2>
            <Products />
            <CheckoutSidebar />
        </Layout>
    );
};

export default IndexPage;
