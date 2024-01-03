import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Breadcrumb } from 'react-bootstrap';
import Link from 'next/link';
import Layout from '../../components/Layout';
import NavAdmin from '../../components/NavAdmin';
import DataTable from '../../components/DataTable';
import Spinner from '../../components/Spinner';

const DiscountsPage: NextPage = () => {
    const router = useRouter();
    const [discounts, setDiscounts] = useState(false);
    useEffect(() => {
        if (!router.isReady) {
            return;
        }

        getDiscounts();
    }, [router.isReady]);

    function getDiscounts() {
        fetch('/api/dashboard/discounts', {
            method: 'GET',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                setDiscounts(data);
            })
            .catch(function (err) {
                // There was an error
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

    // Check for products
    if (!discounts) {
        return <></>;
    }

    const columns = [
        {
            name: 'id',
            title: 'Discount ID',
            link: '/admin/discount/',
        },
        {
            name: 'code',
            title: 'Code',
        },
        {
            name: 'type',
            title: 'Type',
        },
        {
            name: 'value',
            title: 'Value',
        },
        {
            name: 'enabled',
            title: 'Status',
            format: 'enabled',
        },
        {
            name: 'start_at',
            title: 'Starts at',
            format: 'date',
        },
        {
            name: 'end_at',
            title: 'Ends at',
            format: 'date',
        },
    ];

    return (
        <Layout title="nextjs-checkout | Products">
            <NavAdmin />
            <h2>Discounts</h2>
            <div className="row">
                <div className="col">
                    <Breadcrumb>
                        <Breadcrumb.Item href="/admin/dashboard">
                            Home
                        </Breadcrumb.Item>
                        <Breadcrumb.Item active>Discounts</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div className="col">
                    <Link
                        className="btn btn-primary float-end"
                        href="/admin/discount-new"
                    >
                        New
                    </Link>
                </div>
            </div>
            <DataTable
                columns={columns}
                data={discounts}
                datamessage={'No results'}
            />
        </Layout>
    );
};

export default DiscountsPage;
