import React from 'react';
import { NextPage } from 'next';
import Layout from '../../components/Layout';
import Navbar from '../../components/Nav';
import SearchResult from '../../components/SearchResult';
import CheckoutSidebar from '../../components/CheckoutSidebar';

const SearchPage: NextPage = () => {
    return (
        <Layout title="nextjs-checkout | Search">
            <Navbar />
            <SearchResult />
            <CheckoutSidebar />
        </Layout>
    );
};

export default SearchPage;
