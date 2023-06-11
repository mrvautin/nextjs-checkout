import React from 'react';
import { NextPage } from 'next';
import Layout from '../../components/Layout';

import Cart from '../../components/Cart';
import Navbar from '../../components/Nav';
import CheckoutResult from '../../components/CheckoutResult';
import CheckoutSidebar from '../../components/CheckoutSidebar';

const ResultPage: NextPage = () => {
    return (
        <Layout title="Shopping Cart | Order">
            <Cart>
                <Navbar />
                <CheckoutResult />
                <CheckoutSidebar />
            </Cart>
        </Layout>
    );
};

export default ResultPage;
