import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
    Breadcrumb,
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

const ProductsPage: NextPage = () => {
    const router = useRouter();
    const [products, setProducts] = useState(false);
    const [searchParameter, setSearchParameter] = useState('id');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchParameterPlaceholder, setSearchParameterPlaceholder] =
        useState('Product ID');
    useEffect(() => {
        if (!router.isReady) {
            return;
        }

        getProducts();
    }, [router.isReady]);

    function getProducts() {
        fetch('/api/dashboard/products', {
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
        fetch('/api/products/search', {
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
    if (!products) {
        return <></>;
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
            <Cart>
                <NavAdmin />
                <h2>Products</h2>
                <Breadcrumb>
                    <Breadcrumb.Item href="/admin/dashboard">
                        Home
                    </Breadcrumb.Item>
                    <Breadcrumb.Item active>Products</Breadcrumb.Item>
                </Breadcrumb>
                <InputGroup className="mb-3">
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
                <DataTable columns={columns} data={products} />
            </Cart>
        </Layout>
    );
};

export default ProductsPage;
