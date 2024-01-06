/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Error from 'next/error';
import { useRouter } from 'next/navigation';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Spinner from './Spinner';
import ProductImages from './ProductImages';
import VariantModal from './ModalVariant';
import { format } from 'date-fns';
import { NumericFormat } from 'react-number-format';
import DataTable from '../components/DataTable';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';
import { removeCurrency } from '../lib/helpers';
import { useSession } from 'next-auth/react';
import { Session } from '../lib/types';

const ProductEdit = props => {
    const { push } = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState(props.product);

    // Check for user session
    const { data: session } = useSession({
        required: true,
        onUnauthenticated() {
            window.location.href = '/api/auth/signin';
        },
    }) as unknown as Session;

    // Check for product
    if (!product) {
        return <Error statusCode={404} withDarkMode={false} />;
    }

    function saveProduct() {
        setLoading(true);
        // fetch
        fetch('/api/product/save', {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'x-user-id': session.user.id,
                'x-api-key': session.user.apiKey,
            },
            body: JSON.stringify(product),
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                // Turn off the spinner
                setLoading(false);

                // Check for error
                if (data.error) {
                    toast(data.error, {
                        hideProgressBar: false,
                        autoClose: 2000,
                        type: 'error',
                    });
                    return;
                }
                setProduct(data);

                toast('Product updated', {
                    hideProgressBar: false,
                    autoClose: 2000,
                    type: 'success',
                });
            })
            .catch(function (err) {
                // There was an error
                setLoading(false);
                toast(err.error, {
                    hideProgressBar: false,
                    autoClose: 2000,
                    type: 'error',
                });
            });
    }

    function deleteProduct() {
        setLoading(true);
        // fetch
        fetch('/api/product/delete', {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'x-user-id': session.user.id,
                'x-api-key': session.user.apiKey,
            },
            body: JSON.stringify(product),
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                // Turn off the spinner
                setLoading(false);

                // Check for error
                if (data.error) {
                    toast(data.error, {
                        hideProgressBar: false,
                        autoClose: 2000,
                        type: 'error',
                    });
                    return;
                }

                toast('Product deleted', {
                    hideProgressBar: false,
                    autoClose: 2000,
                    type: 'success',
                });
                push('/admin/products');
            })
            .catch(function (err) {
                // There was an error
                setLoading(false);
                toast(err.error, {
                    hideProgressBar: false,
                    autoClose: 2000,
                    type: 'error',
                });
            });
    }

    function deleteVariant(id) {
        setLoading(true);
        // fetch
        fetch('/api/variants/delete', {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'x-user-id': session.user.id,
                'x-api-key': session.user.apiKey,
            },
            body: JSON.stringify({ id: id }),
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                // Turn off the spinner
                setLoading(false);

                // Check for error
                if (data.error) {
                    toast(data.error, {
                        hideProgressBar: false,
                        autoClose: 2000,
                        type: 'error',
                    });
                    return;
                }

                toast('Variant deleted', {
                    hideProgressBar: false,
                    autoClose: 2000,
                    type: 'success',
                });
                window.location.reload();
            })
            .catch(function (err) {
                // There was an error
                setLoading(false);
                toast(err.error, {
                    hideProgressBar: false,
                    autoClose: 2000,
                    type: 'error',
                });
            });
    }

    const columns = [
        {
            name: 'id',
            title: 'Delete',
            function: id => {
                deleteVariant(id);
            },
        },
        {
            name: 'title',
            title: 'Title',
        },
        {
            name: 'values',
            title: 'Values',
        },
    ];

    return (
        <>
            <Row>
                <Spinner loading={loading} />
                <Col className="text-end" sm={12} xs={12}>
                    <Button
                        className="me-1"
                        onClick={() => deleteProduct()}
                        variant="danger"
                    >
                        Delete
                    </Button>
                    <Button onClick={() => saveProduct()}>Save</Button>
                </Col>
            </Row>
            <Row>
                <Col className="g-3" sm={6} xs={12}>
                    <Row>
                        <Col sm={12}>
                            <Row>
                                <Col xs={8}>
                                    <Form.Label className="fw-bold">
                                        Product Id
                                    </Form.Label>
                                    <div className="form-control">
                                        {product.id}
                                    </div>
                                </Col>
                                <Col xs={4}>
                                    <Form.Label className="fw-bold">
                                        Created
                                    </Form.Label>
                                    <div className="form-control">
                                        {format(
                                            new Date(product.created_at),
                                            'dd/MM/yyyy KK:mmaaa',
                                        )}
                                    </div>
                                </Col>
                                <Col className="mt-3" xs={12}>
                                    <Form.Label className="fw-bold">
                                        Name
                                    </Form.Label>
                                    <input
                                        className="form-control"
                                        name="Name"
                                        onChange={event =>
                                            setProduct({
                                                ...product,
                                                name: event.target.value,
                                            })
                                        }
                                        value={product.name}
                                    />
                                </Col>
                                <Col className="mt-3" xs={12}>
                                    <Form.Label className="fw-bold">
                                        Permalink
                                    </Form.Label>
                                    <input
                                        className="form-control"
                                        name="permalink"
                                        onChange={event =>
                                            setProduct({
                                                ...product,
                                                permalink: event.target.value,
                                            })
                                        }
                                        value={product.permalink}
                                    />
                                </Col>
                                <Col className="mt-3" xs={12}>
                                    <Form.Label className="fw-bold">
                                        Summary
                                    </Form.Label>
                                    <textarea
                                        className="form-control"
                                        name="Summary"
                                        onChange={event =>
                                            setProduct({
                                                ...product,
                                                summary: event.target.value,
                                            })
                                        }
                                        rows={4}
                                        value={product.summary}
                                    />
                                </Col>
                                <Col className="mt-3" xs={6}>
                                    <Form.Label className="fw-bold">
                                        Price
                                    </Form.Label>
                                    <NumericFormat
                                        allowNegative={false}
                                        className="form-control"
                                        decimalScale={2}
                                        fixedDecimalScale
                                        onChange={event =>
                                            setProduct({
                                                ...product,
                                                price: removeCurrency(
                                                    event.target.value,
                                                ),
                                            })
                                        }
                                        prefix={'$'}
                                        value={product.price / 100}
                                    />
                                </Col>
                                <Col className="mt-3" xs={6}>
                                    <Form.Label className="fw-bold">
                                        Status
                                    </Form.Label>
                                    <select
                                        className="form-control"
                                        onChange={event =>
                                            setProduct({
                                                ...product,
                                                // eslint-disable-next-line prettier/prettier
                                                enabled: (event.target.value === 'true'),
                                            })
                                        }
                                        value={product.enabled}
                                    >
                                        <option value="true">Enabled</option>
                                        <option value="false">Disabled</option>
                                    </select>
                                </Col>
                                <Col className="mt-3" xs={12}>
                                    <Button
                                        onClick={() => {
                                            setShowModal(true);
                                        }}
                                    >
                                        New variant
                                    </Button>
                                    <VariantModal
                                        onCancel={() => {
                                            setShowModal(false);
                                        }}
                                        onConfirm={() => {
                                            setShowModal(false);
                                        }}
                                        productId={product.id}
                                        showmodal={showModal}
                                    />
                                    <DataTable
                                        columns={columns}
                                        data={product.variants || []}
                                        datamessage={'No variants'}
                                    />
                                </Col>
                                <ProductImages product={product} />
                            </Row>
                        </Col>
                    </Row>
                </Col>
                <Col className="g-3" sm={6} xs={12}>
                    <Row>
                        <Col sm={12}>
                            <Row>
                                <Col xs={12}>
                                    <Form.Label className="fw-bold">
                                        Description
                                    </Form.Label>
                                    <ReactQuill
                                        onChange={value => {
                                            setProduct({
                                                ...product,
                                                description: value,
                                            });
                                        }}
                                        theme="snow"
                                        value={product.description}
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    );
};

export default ProductEdit;
