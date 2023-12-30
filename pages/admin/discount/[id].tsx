import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import NavAdmin from '../../../components/NavAdmin';
import Discount from '../../../components/DiscountAdmin';
import Spinner from '../../../components/Spinner';
import { Session } from '../../../lib/types';

const DiscountPage: NextPage = () => {
    const router = useRouter();
    const [discount, setDiscount] = useState(false);
    useEffect(() => {
        const discountId = router.query.id;
        if (session) {
            getDiscount(discountId);
        }
    });

    // Check for user session
    const { data: session } = useSession({
        required: true,
        onUnauthenticated() {
            window.location.href = '/api/auth/signin';
        },
    }) as unknown as Session;

    function getDiscount(discountId) {
        fetch('/api/discount/get', {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'x-user-id': session.user.id,
                'x-api-key': session.user.apiKey,
            },
            body: JSON.stringify({
                id: discountId,
            }),
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                setDiscount(data);
            })
            .catch(function (err) {
                console.log('Payload error:' + err);
            });
    }

    // Check for discount
    if (!discount) {
        return <Spinner loading={true} />;
    }

    return (
        <Layout title="nextjs-checkout | Discount">
            <NavAdmin />
            <h2>Discount</h2>
            <Discount discount={discount} type="edit" />
        </Layout>
    );
};

export default DiscountPage;
