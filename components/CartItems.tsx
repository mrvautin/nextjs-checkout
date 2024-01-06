/* eslint-disable @next/next/no-img-element */
import React, { useContext, useEffect, useState } from 'react';
import Spinner from '../components/Spinner';
import { CartContext } from '../context/Cart';
import { toast } from 'react-toastify';
import { Button, Col, Form, InputGroup, ListGroup, Row } from 'react-bootstrap';
import { calculateCartTotal, currency } from '../lib/helpers';

type Props = {
    type: string;
};

const CartItems = (props: Props) => {
    const [loading, setLoading] = useState(false);
    const {
        cartTotal,
        items,
        setMetadata,
        metadata,
        totalItems,
        updateItemQuantity,
    } = useContext(CartContext);
    const [discount, setDiscount] = useState('');
    const checkedCartTotal = calculateCartTotal(cartTotal(), metadata);

    useEffect(() => {
        if (metadata.discount && metadata.discount.code) {
            setDiscount(metadata.discount.code);
        }
    }, []);

    function checkDiscountCode() {
        setLoading(true);
        // fetch
        fetch('/api/discount/checkcode', {
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
                setDiscount(data.code);
                setMetadata({
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
        setMetadata(cartMeta);
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
                    className="itemReduceQuantity"
                    onClick={() => updateItemQuantity(item, 'reduce', 1)}
                    variant="dark"
                >
                    -
                </Button>
                <Form.Control
                    aria-label="Item quantity"
                    className="text-center itemQuantity"
                    readOnly
                    value={item.quantity}
                />
                <Button
                    className="itemIncreaseQuantity"
                    onClick={() => updateItemQuantity(item, 'add', 1)}
                    variant="dark"
                >
                    +
                </Button>
            </InputGroup>
        );
    }

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
        <>
            <Spinner loading={loading} />
            <ListGroup className="pb-4 border-bottom cartItems">
                {items.map((item, index) => (
                    <ListGroup.Item
                        as="li"
                        className="product-card"
                        key={'cartItem-' + index}
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
                                <Row>{cartQuantity(item)}</Row>
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
                                <div>{totalItems()}</div>
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
                            <h6>{currency(checkedCartTotal / 100)}</h6>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    );
};

export default CartItems;
