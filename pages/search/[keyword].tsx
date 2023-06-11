import React from 'react';
import { NextPage } from 'next';
import Layout from '../../components/Layout';

import Cart from '../../components/Cart';
import Navbar from '../../components/Nav';
import SearchResult from '../../components/SearchResult';
import CheckoutSidebar from '../../components/CheckoutSidebar';

const SearchPage: NextPage = () => {
    return (
        <Layout title="Shopping Cart | Search">
            <Cart>
                <Navbar />
                <SearchResult />
                <CheckoutSidebar />
            </Cart>
        </Layout>
    );
};

export default SearchPage;
