import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import Cart from '../../../components/Cart';
import NavAdmin from '../../../components/NavAdmin';
import Customer from '../../../components/Customer';
import Spinner from '../../../components/Spinner';

const CustomerPage: NextPage = () => {
    const router = useRouter();
    const [customerData, setCustomerData] = useState(false);
    useEffect(() => {
        if (!router.isReady) {
            return;
        }
        const customerId = router.query.id;
        getCustomer(customerId);
    }, [router.isReady]);

    function getCustomer(customerId) {
        fetch('/api/customer', {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                customerId: customerId,
            }),
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                setCustomerData(data);
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

    // Check for customer
    if (!customerData) {
        return <></>;
    }

    return (
        <Layout title="Shopping Cart | Customer">
            <Cart>
                <NavAdmin />
                <h2>Customer</h2>
                <Customer data={customerData} />
            </Cart>
        </Layout>
    );
};

export default CustomerPage;
