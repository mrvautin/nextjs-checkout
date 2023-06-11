import React from 'react';
import { NextPage } from 'next';
import Layout from '../../components/Layout';

import Cart from '../../components/Cart';
import Navbar from '../../components/Nav';
import Product from '../../components/Product';
import CheckoutSidebar from '../../components/CheckoutSidebar';

const ProductPage: NextPage = () => {
    return (
        <Layout title="Shopping Cart | Product">
            <Cart>
                <Navbar />
                <Product />
                <CheckoutSidebar />
            </Cart>
        </Layout>
    );
};

export default ProductPage;
