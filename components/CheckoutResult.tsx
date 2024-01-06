/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { CartContext } from '../context/Cart';
import { Col, Row, Table } from 'react-bootstrap';
import { BagCheckFill } from 'react-bootstrap-icons';
import { BagXFill } from 'react-bootstrap-icons';

const CheckoutResult = () => {
    const router = useRouter();
    const { emptyCart } = useContext(CartContext);
    const [order, setOrder] = useState<any>();

    useEffect(() => {
        if (!router.isReady) {
            return;
        }

        getOrder();
    }, [router.isReady]);

    function getOrder() {
        const orderId = router.query.id;

        // fetch
        fetch('/api/order', {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                orderId: orderId,
            }),
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                emptyCart();
                setOrder(data);
            })
            .catch(function (err) {
                // There was an error
                console.log('Payload error:' + err);
            });
    }

    function printOutcome() {
        if (order.paid === true) {
            return (
                <div>
                    <BagCheckFill className="text-success" size={96} />
                    <h1
                        className="text-success"
                        data-test-id="transaction-result"
                    >
                        Transaction successful
                    </h1>
                </div>
            );
        }
        return (
            <div>
                <BagXFill className="text-danger" size={96} />
                <h1 className="text-danger" data-test-id="transaction-result">
                    Transaction failed
                </h1>
            </div>
        );
    }

    // Check order
    if (!order) {
        return <></>;
    }

    return (
        <Row>
            <Col className="g-3" sm={{ span: 10, offset: 1 }} xs={12}>
                <Row>
                    <Col
                        className="text-center mb-3"
                        sm={{ span: 8, offset: 2 }}
                        xs={12}
                    >
                        {printOutcome()}
                    </Col>
                    <Col sm={{ span: 10, offset: 1 }} xs={12}>
                        <Table borderless responsive>
                            <tbody>
                                <tr>
                                    <td>
                                        <h6 className="text-dark">Order ID</h6>
                                    </td>
                                    <td className="text-break">{order.id}</td>
                                </tr>
                                <tr>
                                    <td>
                                        <h6 className="text-dark">
                                            Transaction ID
                                        </h6>
                                    </td>
                                    <td>{order.transaction_id}</td>
                                </tr>
                                <tr>
                                    <td>
                                        <h6 className="text-dark">
                                            Checkout ID
                                        </h6>
                                    </td>
                                    <td>{order.checkout_id}</td>
                                </tr>
                                <tr>
                                    <td>
                                        <h6 className="text-dark">Status</h6>
                                    </td>
                                    <td>{order.status}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default CheckoutResult;
