import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import NavAdmin from '../../../components/NavAdmin';
import Customer from '../../../components/Customer';
import Spinner from '../../../components/Spinner';
import { Session } from '../../../lib/types';

const CustomerPage: NextPage = () => {
    const router = useRouter();
    const [customerData, setCustomerData] = useState(false);

    // Check for user session
    const { data: session } = useSession({
        required: true,
        onUnauthenticated() {
            window.location.href = '/api/auth/signin';
        },
    }) as unknown as Session;

    useEffect(() => {
        if (session) {
            const customerId = router.query.id;
            getCustomer(customerId);
        }
    }, [session]);

    function getCustomer(customerId) {
        fetch('/api/customer', {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'x-user-id': session.user.id,
                'x-api-key': session.user.apiKey,
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

    // Check for customer
    if (!customerData) {
        return <Spinner loading={true} />;
    }

    return (
        <Layout title="nextjs-checkout | Customer">
            <NavAdmin />
            <h2>Customer</h2>
            <Customer data={customerData} />
        </Layout>
    );
};

export default CustomerPage;
