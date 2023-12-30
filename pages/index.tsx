import React from 'react';
import { NextPage } from 'next';
import Layout from '../components/Layout';
import Cart from '../components/Cart';
import Products from '../components/Products';
import Navbar from '../components/Nav';
import CheckoutSidebar from '../components/CheckoutSidebar';

const IndexPage: NextPage = () => {
    return (
        <Layout title="nextjs-checkout | Shop">
            <Cart>
                <Navbar />
                <h2>Shop</h2>
                <Products />
                <CheckoutSidebar />
            </Cart>
        </Layout>
    );
};

export default IndexPage;
