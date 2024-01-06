import React from 'react';
import { NextPage } from 'next';
import Layout from '../../components/Layout';
import Navbar from '../../components/Nav';
import CheckoutResult from '../../components/CheckoutResult';
import CheckoutSidebar from '../../components/CheckoutSidebar';

const ResultPage: NextPage = () => {
    return (
        <Layout title="nextjs-checkout | Order">
            <Navbar />
            <CheckoutResult />
            <CheckoutSidebar />
        </Layout>
    );
};

export default ResultPage;
