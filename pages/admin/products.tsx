import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    Breadcrumb,
    Button,
    Dropdown,
    DropdownButton,
    Form,
    InputGroup,
} from 'react-bootstrap';
import Layout from '../../components/Layout';
import NavAdmin from '../../components/NavAdmin';
import DataTable from '../../components/DataTable';
import Spinner from '../../components/Spinner';
import { Session } from '../../lib/types';

const ProductsPage: NextPage = () => {
    const [products, setProducts] = useState(false);
    const [searchParameter, setSearchParameter] = useState('id');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchParameterPlaceholder, setSearchParameterPlaceholder] =
        useState('Product ID');

    // Check for user session
    const { data: session } = useSession({
        required: true,
        onUnauthenticated() {
            window.location.href = '/api/auth/signin';
        },
    }) as unknown as Session;

    useEffect(() => {
        if (session) {
            getProducts();
        }
    }, [session]);

    function getProducts() {
        fetch('/api/products/admin', {
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
                setProducts(data);
            })
            .catch(function (err) {
                // There was an error
                console.log('Payload error:' + err);
            });
    }

    function searchProducts() {
        fetch('/api/dashboard/products/search', {
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
                setProducts(data);
            })
            .catch(function (err) {
                // There was an error
                console.log('Payload error:' + err);
            });
    }

    // Check for products
    if (!products) {
        return <Spinner loading={true} />;
    }

    const columns = [
        {
            name: 'id',
            title: 'Product ID',
            link: '/admin/product/',
        },
        {
            name: 'name',
            title: 'Name',
        },
        {
            name: 'price',
            title: 'Price',
            format: 'amount',
        },
        {
            name: 'enabled',
            title: 'Status',
            format: 'enabled',
        },
        {
            name: 'created_at',
            title: 'Created',
            format: 'date',
        },
    ];

    return (
        <Layout title="nextjs-checkout | Products">
            <NavAdmin />
            <h2>Products</h2>
            <div className="row">
                <div className="col">
                    <Breadcrumb>
                        <Breadcrumb.Item href="/admin/dashboard">
                            Home
                        </Breadcrumb.Item>
                        <Breadcrumb.Item active>Products</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div className="col">
                    <Link
                        className="btn btn-primary float-end"
                        href="/admin/product-new"
                    >
                        New
                    </Link>
                </div>
            </div>
            <InputGroup className="mt-2 mb-3">
                <DropdownButton
                    title={searchParameterPlaceholder}
                    variant="outline-secondary"
                >
                    <Dropdown.Item
                        onClick={() => {
                            setSearchParameter('id');
                            setSearchParameterPlaceholder('Product ID');
                        }}
                    >
                        Product ID
                    </Dropdown.Item>
                    <Dropdown.Item
                        onClick={() => {
                            setSearchParameter('name');
                            setSearchParameterPlaceholder('Product name');
                        }}
                    >
                        Product name
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
                        searchProducts();
                    }}
                    variant="outline-success"
                >
                    Filter
                </Button>
                <Button
                    onClick={() => {
                        getProducts();
                        setSearchParameter('id');
                        setSearchParameterPlaceholder('Product ID');
                        setSearchTerm('');
                    }}
                    variant="outline-danger"
                >
                    X
                </Button>
            </InputGroup>
            <DataTable
                columns={columns}
                data={products}
                datamessage={'No results'}
            />
        </Layout>
    );
};

export default ProductsPage;
