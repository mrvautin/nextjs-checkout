import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import NavAdmin from '../../../components/NavAdmin';
import Discount from '../../../components/DiscountAdmin';
import Spinner from '../../../components/Spinner';

const DiscountPage: NextPage = () => {
    const router = useRouter();
    const [discount, setDiscount] = useState(false);
    useEffect(() => {
        if (!router.isReady) {
            return;
        }
        const discountId = router.query.id;
        getDiscount(discountId);
    }, [router.isReady]);

    function getDiscount(discountId) {
        fetch('/api/dashboard/discount/get', {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
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

    // Check for discount
    if (!discount) {
        return <></>;
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
