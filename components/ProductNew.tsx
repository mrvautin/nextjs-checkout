/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Spinner from './Spinner';
import { NumericFormat } from 'react-number-format';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';
import { useSession } from 'next-auth/react';
import { Session } from '../lib/types';

const ProductForm = () => {
    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState({
        name: 'Product name',
        permalink: 'product-permalink',
        summary: 'Product summary',
        description: 'Product description',
        price: '1000',
        enabled: true,
    });

    // Check for user session
    const { data: session } = useSession({
        required: true,
        onUnauthenticated() {
            window.location.href = '/api/auth/signin';
        },
    }) as unknown as Session;

    function createProduct() {
        setLoading(true);
        // fetch
        fetch('/api/product/create', {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'x-user-id': session.user.id,
                'x-api-key': session.user.apiKey,
            },
            body: JSON.stringify({
                name: product.name,
                permalink: product.permalink,
                summary: product.summary,
                description: product.description,
                price: parseInt(product.price),
                enabled: product.enabled,
            }),
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

                toast('Product created', {
                    hideProgressBar: false,
                    autoClose: 2000,
                    type: 'success',
                });
            })
            .catch(function () {
                // There was an error
                setLoading(false);
                toast('Error creating product', {
                    hideProgressBar: false,
                    autoClose: 2000,
                    type: 'error',
                });
            });
    }

    return (
        <>
            <Row>
                <Spinner loading={loading} />
                <Col className="text-end" sm={12} xs={12}>
                    <Button onClick={() => createProduct()}>Save</Button>
                </Col>
            </Row>
            <Row>
                <Col className="g-3" sm={6} xs={12}>
                    <Row>
                        <Col sm={12}>
                            <Row>
                                <Col xs={12}>
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
                                                price: event.target.value,
                                            })
                                        }
                                        prefix={'$'}
                                        value={(product.price as any) / 100}
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
                                        value={product.enabled as any}
                                    >
                                        <option value="true">Enabled</option>
                                        <option value="false">Disabled</option>
                                    </select>
                                </Col>
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

export default ProductForm;
