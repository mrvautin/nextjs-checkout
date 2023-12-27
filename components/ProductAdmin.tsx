/* eslint-disable react/no-danger-with-children */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import Error from 'next/error';
import { Breadcrumb, Col, Row } from 'react-bootstrap';
import ProductEdit from './ProductEdit';
import ProductNew from './ProductNew';

const Product = props => {
    // Return error if we don't have a product
    if (props.product && Object.keys(props.product).length === 0) {
        return <Error statusCode={404} withDarkMode={false} />;
    }

    const ProductForm = () => {
        if (props.type === 'edit') {
            return <ProductEdit product={props.product} />;
        }
        return <ProductNew />;
    };

    const ProductName = () => {
        if (props.product && props.product.name) {
            return (
                <Breadcrumb.Item active>{props.product.name}</Breadcrumb.Item>
            );
        }
        return;
    };

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
                    {ProductName()}
                </Breadcrumb>
                {ProductForm()}
            </Col>
        </Row>
    );
};

export default Product;
