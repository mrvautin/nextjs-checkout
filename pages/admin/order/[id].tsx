import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import NavAdmin from '../../../components/NavAdmin';
import Order from '../../../components/Order';
import Spinner from '../../../components/Spinner';

const OrdersPage: NextPage = () => {
    const router = useRouter();
    const [order, setOrder] = useState(false);
    useEffect(() => {
        if (!router.isReady) {
            return;
        }
        const orderId = router.query.id;
        getOrder(orderId);
    }, [router.isReady]);

    function getOrder(orderId) {
        fetch('/api/order', {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                orderId: orderId,
            }),
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                setOrder(data);
            })
            .catch(function (err) {
                console.log('Payload error:' + err);
            });
    }

    // Check for user session
    const { status } = useSession({
        required: true,
        onUnauthenticated() {
            window.location.href = '/api/auth/signin';
        },
    });

    if (status === 'loading') {
        return <Spinner loading={true} />;
    }

    // Check for orders
    if (!order) {
        return <></>;
    }

    return (
        <Layout title="nextjs-checkout | Order">
            <NavAdmin />
            <h2>Order</h2>
            <Order order={order} />
        </Layout>
    );
};

export default OrdersPage;
