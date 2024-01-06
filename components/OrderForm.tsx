/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import Error from 'next/error';
import { Col, Form, ListGroup, Row } from 'react-bootstrap';
import { format } from 'date-fns';
import { currency } from '../lib/helpers';

const OrderForm = props => {
    const order = props.order;
    if (!order) {
        return <Error statusCode={404} withDarkMode={false} />;
    }

    const cart = order.cart;

    // Check for product image and toggle placeholder
    const productImage = item => {
        if (item.images && item.images.length > 0) {
            return (
                <img
                    alt={item.images[0].alt}
                    className="img-fluid"
                    src={item.images[0].url}
                />
            );
        }
        return (
            <img
                alt={'Product placeholder image'}
                className="img-fluid"
                src={'/placeholder.png'}
            />
        );
    };

    const productVariants = item => {
        const variants = [];
        for (const variantKey in item.selectedVariants) {
            const variant = item.selectedVariants[variantKey];
            variants.push(
                <p key={'cartItem-' + variantKey}>
                    {variant.title}: {variant.value}
                </p>,
            );
        }
        if (variants.length > 0) {
            return <Row>{variants}</Row>;
        }
        return;
    };

    return (
        <Row>
            <Col className="g-3" sm={7} xs={12}>
                <Row>
                    <Col sm={12}>
                        <Row>
                            <Col xs={12}>
                                <Form.Label>Order Id</Form.Label>
                                <input
                                    className="form-control"
                                    disabled
                                    name="id"
                                    readOnly
                                    value={order.id}
                                />
                            </Col>
                            <Col className="mt-3" xs={12}>
                                <Form.Label>Date</Form.Label>
                                <input
                                    className="form-control"
                                    disabled
                                    name="Date"
                                    readOnly
                                    value={format(
                                        new Date(order.created_at),
                                        'dd/MM/yyyy KK:mmaaa',
                                    )}
                                />
                            </Col>
                            <Col className="mt-3" xs={6}>
                                <Form.Label>Status</Form.Label>
                                <input
                                    className="form-control"
                                    disabled
                                    name="Status"
                                    readOnly
                                    value={order.status}
                                />
                            </Col>
                            <Col className="mt-3" xs={6}>
                                <Form.Label>Customer</Form.Label>
                                <p>
                                    <a
                                        href={
                                            '/admin/customer/' +
                                            order.customerId
                                        }
                                    >
                                        {order.customerId}
                                    </a>
                                </p>
                            </Col>
                            <Col className="mt-3" xs={6}>
                                <Form.Label>Gateway</Form.Label>
                                <input
                                    className="form-control"
                                    disabled
                                    name="Date"
                                    readOnly
                                    value={order.gateway}
                                />
                            </Col>
                            <Col className="mt-3" xs={6}>
                                <Form.Label>Paid</Form.Label>
                                <input
                                    className="form-control"
                                    disabled
                                    name="Date"
                                    readOnly
                                    value={order.paid}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
            <Col className="g-3" sm={5} xs={12}>
                <ListGroup className="pb-4 border-bottom cartItems">
                    {cart.map(item => (
                        <ListGroup.Item
                            as="li"
                            className="product-card"
                            key={item.id}
                        >
                            <Row>
                                <Col xs={4}>{productImage(item)}</Col>
                                <Col xs={8}>
                                    <Row>
                                        <Col xs={6}>
                                            <h6>
                                                <div>{item.name}</div>
                                            </h6>
                                        </Col>
                                        <Col className="text-end" xs={6}>
                                            <div>
                                                {currency(item.itemTotal / 100)}
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <div className="text-end">
                                            Quantity:
                                            <span className="text-primary">
                                                {' '}
                                                {item.quantity}
                                            </span>
                                        </div>
                                    </Row>
                                    {productVariants(item)}
                                </Col>
                            </Row>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
                <Row>
                    <Col xs={12}>
                        <Row className="ms-1 me-1">
                            <Col className="mt-3 text-left" xs={6}>
                                <h6>Total items:</h6>
                            </Col>
                            <Col className="mt-3 text-end" xs={6}>
                                <h6>
                                    <div>{order.totalUniqueItems}</div>
                                </h6>
                            </Col>
                            <Col className="mt-3 text-left" xs={6}>
                                <h6>Shipping</h6>
                            </Col>
                            <Col className="mt-3 text-end" xs={6}>
                                <h6>
                                    <div>FREE</div>
                                </h6>
                            </Col>
                            <Col className="mt-3 text-left" xs={6}>
                                <h6>Cart total:</h6>
                            </Col>
                            <Col className="mt-3 text-end" xs={6}>
                                <h6>{currency(order.totalAmount / 100)}</h6>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default OrderForm;
