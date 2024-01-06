/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import CartItems from '../components/CartItems';
import { CartContext } from '../context/Cart';
import CustomerForm from '../components/CustomerForm';
import Spinner from './Spinner';
import { calculateCartTotal } from '../lib/helpers';

const Checkout = () => {
    const [loading, setLoading] = useState(false);
    const { cartTotal, totalUniqueItems, items } = useContext(CartContext);
    const checkedCartTotal = calculateCartTotal(cartTotal(), {});

    async function createCheckout(formData) {
        // Set the amount of the cart
        const payload = {
            totalAmount: checkedCartTotal,
            totalUniqueItems: totalUniqueItems(),
            customer: formData,
            cart: items,
            meta: {},
        };

        // Set spinner to loading
        setLoading(true);

        // fetch
        const paymentConfig = process.env.NEXT_PUBLIC_PAYMENT_CONFIG;
        fetch(`/api/${paymentConfig}/create-checkout`, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
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

                // Redirect to the Checkout URL
                window.location.href = data.checkout.url;
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

    const checkoutButton = (
        <button
            className="col-sm-12 btn btn-primary"
            data-test-id="checkout-payment"
            type="submit"
        >
            Checkout
        </button>
    );

    return (
        <Row>
            <Spinner loading={loading} />
            <Col className="g-3 checkout-left d-none d-sm-block" sm={6} xs={12}>
                <Row>
                    <Col sm={{ span: 10, offset: 1 }} xs={12}>
                        <CartItems type="checkout" />
                    </Col>
                </Row>
            </Col>
            <Col className="g-3 checkout-right" sm={6} xs={12}>
                <Row>
                    <CustomerForm
                        button={checkoutButton}
                        submitForm={createCheckout}
                    />
                </Row>
            </Col>
        </Row>
    );
};

export default Checkout;
