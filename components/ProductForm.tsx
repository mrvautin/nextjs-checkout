/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Error from 'next/error';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import ProductImages from '../components/ProductImages';
import { format } from 'date-fns';
import { NumericFormat } from 'react-number-format';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

const ProductForm = props => {
    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState(props.product);

    // Check for product
    if (!product) {
        return <Error statusCode={404} withDarkMode={false} />;
    }

    function saveProduct() {
        setLoading(true);
        // fetch
        fetch('/api/dashboard/product/save', {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
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
                    alert('Payload error:' + data.error);
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
                alert('Payload error:' + err.error);
            });
    }

    return (
        <>
            <Row>
                <Spinner loading={loading} />
                <Col className="text-end" sm={12} xs={12}>
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
                                                price: event.target.value,
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

export default ProductForm;
