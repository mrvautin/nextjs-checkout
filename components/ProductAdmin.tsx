/* eslint-disable react/no-danger-with-children */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import Error from 'next/error';
import { Breadcrumb, Col, Row } from 'react-bootstrap';
import ProductForm from './ProductForm';

const Product = props => {
    // Return error if we don't have a product
    if (props.product && Object.keys(props.product).length === 0) {
        return <Error statusCode={404} withDarkMode={false} />;
    }

    return (
        <Row>
            <Col className="mb-4" md={12}>
                <Breadcrumb>
                    <Breadcrumb.Item href="/admin/dashboard">
                        Home
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href="/admin/products">
                        Products
                    </Breadcrumb.Item>
                    <Breadcrumb.Item active>
                        {props.product.name}
                    </Breadcrumb.Item>
                </Breadcrumb>
                <ProductForm product={props.product} />
            </Col>
        </Row>
    );
};

export default Product;
