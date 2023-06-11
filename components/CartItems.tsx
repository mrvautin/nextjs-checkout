/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { useCart } from 'react-use-cart';
import { Button, Col, Form, InputGroup, ListGroup, Row } from 'react-bootstrap';
import { currency } from '../lib/helpers';

type Props = {
    type: string;
};

const CartItems = (props: Props) => {
    const { items, cartTotal, totalItems, updateItemQuantity } = useCart();

    function cartQuantity(item) {
        if (props.type === 'result') {
            return (
                <div className="text-end">
                    Quantity:
                    <span className="text-primary"> {item.quantity}</span>
                </div>
            );
        }
        return (
            <InputGroup className="mb-3">
                <Button
                    onClick={() =>
                        updateItemQuantity(item.id, item.quantity - 1)
                    }
                    variant="dark"
                >
                    -
                </Button>
                <Form.Control
                    aria-label="Item quantity"
                    className="text-center"
                    readOnly
                    value={item.quantity}
                />
                <Button
                    onClick={() =>
                        updateItemQuantity(item.id, item.quantity + 1)
                    }
                    variant="dark"
                >
                    +
                </Button>
            </InputGroup>
        );
    }

    return (
        <>
            <ListGroup className="pb-4 border-bottom cartItems">
                {items.map(item => (
                    <ListGroup.Item
                        as="li"
                        className="product-card"
                        key={item.id}
                    >
                        <Row>
                            <Col xs={4}>
                                <img
                                    alt={item.images[0].attribution}
                                    className="img-fluid"
                                    src={item.images[0].src}
                                />
                            </Col>
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
                                <Row>{cartQuantity(item)}</Row>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                ))}
            </ListGroup>
            <Row>
                <Col xs={{ span: 10, offset: 1 }}>
                    <Row>
                        <Col className="mt-3 text-left" xs={6}>
                            <h6>Total items:</h6>
                        </Col>
                        <Col className="mt-3 text-end" xs={6}>
                            <h6>
                                <div>{totalItems}</div>
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
                            <h6>{currency(cartTotal / 100)}</h6>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    );
};

export default CartItems;
