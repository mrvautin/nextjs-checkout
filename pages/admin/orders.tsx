import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
    Button,
    Dropdown,
    DropdownButton,
    Form,
    InputGroup,
} from 'react-bootstrap';
import Layout from '../../components/Layout';
import Cart from '../../components/Cart';
import NavAdmin from '../../components/NavAdmin';
import DataTable from '../../components/DataTable';
import Spinner from '../../components/Spinner';

const OrdersPage: NextPage = () => {
    const router = useRouter();
    const [orders, setOrders] = useState(false);
    const [searchParameter, setSearchParameter] = useState('id');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchParameterPlaceholder, setSearchParameterPlaceholder] =
        useState('Order ID');
    useEffect(() => {
        if (!router.isReady) {
            return;
        }

        getOrders();
    }, [router.isReady]);

    function getOrders() {
        fetch('/api/orders', {
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
                setOrders(data);
            })
            .catch(function (err) {
                // There was an error
                console.log('Payload error:' + err);
            });
    }

    function searchOrders() {
        fetch('/api/orders/search', {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                searchTerm: searchTerm,
                searchParameter: searchParameter,
            }),
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                setOrders(data);
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

    // Check for orders
    if (!orders) {
        return <></>;
    }

    const columns = [
        {
            name: 'id',
            title: 'Order ID',
            link: '/admin/order/',
        },
        {
            name: 'created_at',
            title: 'Date',
            format: 'date',
        },
        {
            name: 'status',
            title: 'Status',
        },
        {
            name: 'gateway',
            title: 'Gateway',
        },
        {
            name: 'customer.email',
            title: 'Customer Email',
        },
        {
            name: 'customer.lastName',
            title: 'Customer Surname',
        },
    ];

    return (
        <Layout title="nextjs-checkout | Orders">
            <Cart>
                <NavAdmin />
                <h2>Orders</h2>
                <InputGroup className="mb-3">
                    <DropdownButton
                        title={searchParameterPlaceholder}
                        variant="outline-secondary"
                    >
                        <Dropdown.Item
                            onClick={() => {
                                setSearchParameter('id');
                                setSearchParameterPlaceholder('Order ID');
                            }}
                        >
                            Order ID
                        </Dropdown.Item>
                        <Dropdown.Item
                            onClick={() => {
                                setSearchParameter('customerEmail');
                                setSearchParameterPlaceholder('Customer Email');
                            }}
                        >
                            Customer Email
                        </Dropdown.Item>
                        <Dropdown.Item
                            onClick={() => {
                                setSearchParameter('customerLastName');
                                setSearchParameterPlaceholder(
                                    'Customer Surname',
                                );
                            }}
                        >
                            Customer Surname
                        </Dropdown.Item>
                        <Dropdown.Item
                            onClick={() => {
                                setSearchParameter('result');
                                setSearchParameterPlaceholder('Result');
                            }}
                        >
                            Result
                        </Dropdown.Item>
                    </DropdownButton>
                    <Form.Control
                        aria-label={searchParameterPlaceholder}
                        onChange={event => {
                            setSearchTerm(event.target.value);
                        }}
                        placeholder={searchParameterPlaceholder}
                        value={searchTerm}
                    />
                    <Button
                        onClick={() => {
                            searchOrders();
                        }}
                        variant="outline-success"
                    >
                        Filter
                    </Button>
                    <Button
                        onClick={() => {
                            getOrders();
                            setSearchParameter('id');
                            setSearchTerm('');
                        }}
                        variant="outline-danger"
                    >
                        X
                    </Button>
                </InputGroup>
                <DataTable columns={columns} data={orders} />
            </Cart>
        </Layout>
    );
};

export default OrdersPage;
