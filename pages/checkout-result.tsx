import { NextPage } from 'next';
import Layout from '../components/Layout';
import Navbar from '../components/Nav';
import Spinner from '../components/Spinner';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const CartPage: NextPage = () => {
    const router = useRouter();

    useEffect(() => {
        if (!router.isReady) {
            return;
        }

        checkResult();
    }, [router.isReady]);

    function checkResult() {
        const payload = router.query;

        // fetch
        const paymentConfig = process.env.NEXT_PUBLIC_PAYMENT_CONFIG;
        fetch(`/api/${paymentConfig}/checkout-hosted-return`, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                window.location.href = `/order/${data.orderId}`;
            })
            .catch(function (err) {
                // There was an error
                console.log('Payload error:' + err);
            });
    }

    return (
        <Layout title="nextjs-checkout | Thanks">
            <Navbar />
            <Spinner loading={true} />
        </Layout>
    );
};

export default CartPage;
