/* eslint-disable react/no-danger-with-children */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import Error from 'next/error';
import { Breadcrumb, Col, Row } from 'react-bootstrap';
import DiscountEdit from './DiscountEdit';
import DiscountNew from './DiscountNew';

const Discount = props => {
    // Return error if we don't have a discount
    if (props.discount && Object.keys(props.discount).length === 0) {
        return <Error statusCode={404} withDarkMode={false} />;
    }

    const DiscountForm = () => {
        if (props.type === 'edit') {
            return <DiscountEdit discount={props.discount} />;
        }
        return <DiscountNew />;
    };

    const DiscountCode = () => {
        if (props.discount && props.discount.code) {
            return (
                <Breadcrumb.Item active>{props.discount.code}</Breadcrumb.Item>
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
                    <Breadcrumb.Item href="/admin/discounts">
                        Discounts
                    </Breadcrumb.Item>
                    {DiscountCode()}
                </Breadcrumb>
                {DiscountForm()}
            </Col>
        </Row>
    );
};

export default Discount;
