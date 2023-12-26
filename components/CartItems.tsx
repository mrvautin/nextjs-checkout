/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import { useCart } from 'react-use-cart';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import { Button, Col, Form, InputGroup, ListGroup, Row } from 'react-bootstrap';
import { calculateCartTotal, currency } from '../lib/helpers';

type Props = {
    type: string;
};

const CartItems = (props: Props) => {
    const [loading, setLoading] = useState(false);
    const { items, setCartMetadata, totalItems, metadata, updateItemQuantity } =
        useCart();
    let { cartTotal } = useCart();
    const [discount, setDiscount] = useState('');
    cartTotal = calculateCartTotal(cartTotal, metadata);

    useEffect(() => {
        if (metadata.discount && metadata.discount.code) {
            setDiscount(metadata.discount.code);
        }
    }, []);

    function checkDiscountCode() {
        setLoading(true);
        // fetch
        fetch('/api/discounts/checkcode', {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                discountCode: discount,
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
                    toast('Invalid discount', {
                        hideProgressBar: false,
                        autoClose: 2000,
                        type: 'error',
                    });
                    return;
                }
                // setDiscount(data);
                setCartMetadata({
                    discount: data,
                });
                toast('Discount applied', {
                    hideProgressBar: false,
                    autoClose: 2000,
                    type: 'success',
                });
            })
            .catch(function () {
                // There was an error
                setLoading(false);
                toast('Invalid discount', {
                    hideProgressBar: false,
                    autoClose: 2000,
                    type: 'error',
                });
            });
    }

    function clearDiscount() {
        setDiscount('');
        const cartMeta = metadata;
        delete cartMeta.discount;
        setCartMetadata(cartMeta);
    }

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
            <Spinner loading={loading} />
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
                                    alt={item.images[0].alt}
                                    className="img-fluid"
                                    src={item.images[0].url}
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
                        <Col className="mt-2 text-end" xs={12}>
                            <div className="input-group mb-3">
                                <input
                                    className="form-control"
                                    name="Name"
                                    onChange={event =>
                                        setDiscount(event.target.value)
                                    }
                                    placeholder="Discount code"
                                    value={discount}
                                />
                                <button
                                    className="btn btn-outline-secondary"
                                    id="button-addon2"
                                    onClick={() => checkDiscountCode()}
                                    type="button"
                                >
                                    Apply
                                </button>
                                <button
                                    className="btn btn-outline-danger"
                                    onClick={() => clearDiscount()}
                                    type="button"
                                >
                                    X
                                </button>
                            </div>
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
