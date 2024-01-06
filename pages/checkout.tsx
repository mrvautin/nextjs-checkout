import { NextPage } from 'next';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import Navbar from '../components/Nav';
import Checkout from '../components/Checkout';
import CheckoutSidebar from '../components/CheckoutSidebar';

const CartPage: NextPage = () => {
    const router = useRouter();

    useEffect(() => {
        if (!router.isReady) {
            return;
        }
    }, [router.isReady]);

    return (
        <Layout title="nextjs-checkout | Cart">
            <Navbar />
            <h2>Checkout</h2>
            <Checkout />
            <CheckoutSidebar />
        </Layout>
    );
};

export default CartPage;
