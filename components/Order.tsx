/* eslint-disable react/no-danger-with-children */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import Error from 'next/error';
import { Breadcrumb, Col, Row } from 'react-bootstrap';
import OrderForm from './OrderForm';

const Order = props => {
    // Return error if we don't have a product
    if (props.order && Object.keys(props.order).length === 0) {
        return <Error statusCode={404} withDarkMode={false} />;
    }

    return (
        <Row>
            <Col className="mb-4" md={12}>
                <Breadcrumb>
                    <Breadcrumb.Item href="/admin/dashboard">
                        Home
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href="/admin/orders">
                        Orders
                    </Breadcrumb.Item>
                    <Breadcrumb.Item active>{props.order.id}</Breadcrumb.Item>
                </Breadcrumb>
                <OrderForm order={props.order} />
            </Col>
        </Row>
    );
};

export default Order;
