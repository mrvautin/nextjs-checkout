/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { useFormik } from 'formik';

const CustomerForm = props => {
    // Setup our customer
    let customer = props.customer;
    if (!customer) {
        customer = {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            address1: '',
            suburb: '',
            state: '',
            postcode: '',
            country: '',
        };
    }

    const [checkoutDetails] = useState<any>(customer);

    const validate = values => {
        const errors = {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            address1: '',
            suburb: '',
            state: '',
            postcode: '',
            country: '',
            hasErrors: false,
        };

        // First name
        if (!values.firstName) {
            errors.firstName = 'Required';
        } else if (values.firstName.length > 15) {
            errors.firstName = 'Must be 15 characters or less';
        } else if (values.firstName.length < 2) {
            errors.firstName = 'Must be greater than 2 characters';
        }
        if (errors.firstName !== '') {
            errors.hasErrors = true;
        }

        // Last name
        if (!values.lastName) {
            errors.lastName = 'Required';
        } else if (values.lastName.length > 15) {
            errors.lastName = 'Must be 20 characters or less';
        } else if (values.lastName.length < 2) {
            errors.lastName = 'Must be greater than 2 characters';
        }
        if (errors.lastName !== '') {
            errors.hasErrors = true;
        }

        // Email address
        if (!values.email) {
            errors.email = 'Required';
        } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
        ) {
            errors.email = 'Invalid email address';
        }
        if (errors.email !== '') {
            errors.hasErrors = true;
        }

        // Phone
        if (!values.phone) {
            errors.phone = 'Required';
        } else if (values.phone.length > 15) {
            errors.phone = 'Must be 15 characters or less';
        } else if (values.phone.length < 8) {
            errors.phone = 'Must be greater than 8 characters';
        }
        if (errors.phone !== '') {
            errors.hasErrors = true;
        }

        // Address
        if (!values.address1) {
            errors.address1 = 'Required';
        } else if (values.address1.length > 20) {
            errors.address1 = 'Must be 20 characters or less';
        } else if (values.address1.length < 2) {
            errors.address1 = 'Must be greater than 2 characters';
        }
        if (errors.address1 !== '') {
            errors.hasErrors = true;
        }

        // Suburb
        if (!values.suburb) {
            errors.suburb = 'Required';
        } else if (values.suburb.length > 20) {
            errors.suburb = 'Must be 20 characters or less';
        } else if (values.suburb.length < 2) {
            errors.suburb = 'Must be greater than 2 characters';
        }
        if (errors.suburb !== '') {
            errors.hasErrors = true;
        }

        // State
        if (!values.state) {
            errors.state = 'Required';
        } else if (values.state.length > 3) {
            errors.state = 'Must be 3 characters or less';
        } else if (values.state.length < 2) {
            errors.state = 'Must be greater than 2 characters';
        }
        if (errors.state !== '') {
            errors.hasErrors = true;
        }

        // Postcode
        if (!values.postcode) {
            errors.postcode = 'Required';
        } else if (values.postcode.length !== 4) {
            errors.postcode = 'Must be 4 characters';
        }
        if (errors.postcode !== '') {
            errors.hasErrors = true;
        }

        // Country
        if (!values.country) {
            errors.country = 'Required';
        } else if (values.country.length < 2) {
            errors.country = 'Must be greater than 2 characters';
        }
        if (errors.country !== '') {
            errors.hasErrors = true;
        }

        if (errors.hasErrors) {
            return errors;
        }
        return {};
    };

    const formik = useFormik({
        initialValues: {
            email: checkoutDetails.email,
            phone: checkoutDetails.phone,
            firstName: checkoutDetails.firstName,
            lastName: checkoutDetails.lastName,
            address1: checkoutDetails.address1,
            suburb: checkoutDetails.suburb,
            state: checkoutDetails.state,
            postcode: checkoutDetails.postcode,
            country: checkoutDetails.country,
        },
        validate,
        onSubmit: values => {
            props.submitForm(values);
        },
    });

    return (
        <Row>
            <Col className="g-3" sm={{ span: 8, offset: 2 }} xs={12}>
                <Row>
                    <Col sm={12}>
                        <Form onSubmit={formik.handleSubmit}>
                            <Row>
                                <Col xs={6}>
                                    <Form.Label>Email address</Form.Label>
                                    <input
                                        className="form-control"
                                        data-test-id="checkout-customer-email"
                                        name="email"
                                        placeholder="Enter email"
                                        {...formik.getFieldProps('email')}
                                    />
                                    {formik.errors.email ? (
                                        <div className="text-danger">
                                            {formik.errors.email}
                                        </div>
                                    ) : null}
                                </Col>
                                <Col xs={6}>
                                    <Form.Label>Phone</Form.Label>
                                    <input
                                        className="form-control"
                                        data-test-id="checkout-customer-phone"
                                        name="phone"
                                        placeholder="Enter Phone"
                                        {...formik.getFieldProps('phone')}
                                    />
                                    {formik.errors.phone ? (
                                        <div className="text-danger">
                                            {formik.errors.phone}
                                        </div>
                                    ) : null}
                                </Col>
                                <Col className="mt-2" xs={6}>
                                    <Form.Label>First name</Form.Label>
                                    <input
                                        className="form-control"
                                        data-test-id="checkout-customer-firstname"
                                        name="firstName"
                                        placeholder="First name"
                                        {...formik.getFieldProps('firstName')}
                                    />
                                    {formik.errors.email ? (
                                        <div className="text-danger">
                                            {formik.errors.firstName}
                                        </div>
                                    ) : null}
                                </Col>
                                <Col className="mt-2" xs={6}>
                                    <Form.Label>Last name</Form.Label>
                                    <input
                                        className="form-control"
                                        data-test-id="checkout-customer-lastname"
                                        name="lastName"
                                        placeholder="Last name"
                                        {...formik.getFieldProps('lastName')}
                                    />
                                    {formik.errors.lastName ? (
                                        <div className="text-danger">
                                            {formik.errors.lastName}
                                        </div>
                                    ) : null}
                                </Col>
                                <Col className="mt-3" xs={12}>
                                    <Form.Label>Address</Form.Label>
                                </Col>
                                <Col className="mb-2" xs={12}>
                                    <input
                                        className="form-control"
                                        data-test-id="checkout-customer-address1"
                                        name="address1"
                                        placeholder="Address"
                                        {...formik.getFieldProps('address1')}
                                    />
                                    {formik.errors.address1 ? (
                                        <div className="text-danger">
                                            {formik.errors.address1}
                                        </div>
                                    ) : null}
                                </Col>
                                <Col className="mb-2" xs={6}>
                                    <input
                                        className="form-control"
                                        data-test-id="checkout-customer-suburb"
                                        name="suburb"
                                        placeholder="Suburb"
                                        {...formik.getFieldProps('suburb')}
                                    />
                                    {formik.errors.suburb ? (
                                        <div className="text-danger">
                                            {formik.errors.suburb}
                                        </div>
                                    ) : null}
                                </Col>
                                <Col className="mb-2" xs={6}>
                                    <select
                                        className="form-control"
                                        data-test-id="checkout-customer-state"
                                        {...formik.getFieldProps('state')}
                                    >
                                        <option value="">Select state</option>
                                        <option value="NSW">NSW</option>
                                        <option value="SA">SA</option>
                                        <option value="VIC">VIC</option>
                                        <option value="ACT">ACT</option>
                                        <option value="QLD">QLD</option>
                                        <option value="NT">NT</option>
                                        <option value="WA">WA</option>
                                    </select>
                                    {formik.errors.state ? (
                                        <div className="text-danger">
                                            {formik.errors.state}
                                        </div>
                                    ) : null}
                                </Col>
                                <Col className="mb-2" xs={6}>
                                    <input
                                        className="form-control"
                                        data-test-id="checkout-customer-postcode"
                                        name="postcode"
                                        placeholder="Postcode"
                                        {...formik.getFieldProps('postcode')}
                                    />
                                    {formik.errors.postcode ? (
                                        <div className="text-danger">
                                            {formik.errors.postcode}
                                        </div>
                                    ) : null}
                                </Col>
                                <Col className="mb-2" xs={6}>
                                    <select
                                        className="form-control"
                                        data-test-id="checkout-customer-australia"
                                        {...formik.getFieldProps('country')}
                                    >
                                        <option value="">Select country</option>
                                        <option value="AU">Australia</option>
                                    </select>
                                    {formik.errors.country ? (
                                        <div className="text-danger">
                                            {formik.errors.country}
                                        </div>
                                    ) : null}
                                </Col>
                            </Row>
                            <Row>
                                <Col className="mt-3 text-end" xs={12}>
                                    {props.button}
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default CustomerForm;
