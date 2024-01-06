import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import NavAdmin from '../../../components/NavAdmin';
import Product from '../../../components/ProductAdmin';
import Spinner from '../../../components/Spinner';

const ProductPage: NextPage = () => {
    const router = useRouter();
    const [product, setProduct] = useState(false);
    useEffect(() => {
        if (!router.isReady) {
            return;
        }
        const productId = router.query.id;
        getProduct(productId);
    }, [router.isReady]);

    function getProduct(productId) {
        fetch('/api/product/admin', {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: productId,
            }),
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                setProduct(data);
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

    // Check for product
    if (!product) {
        return <></>;
    }

    return (
        <Layout title="nextjs-checkout | Product">
            <NavAdmin />
            <h2>Product</h2>
            <Product product={product} type="edit" />
        </Layout>
    );
};

export default ProductPage;
