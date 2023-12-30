/* eslint-disable react/no-danger-with-children */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import Error from 'next/error';
import { Breadcrumb, Col, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import Spinner from './Spinner';
import CustomerForm from './CustomerForm';
import { Session } from '../lib/types';

const Customer = props => {
    const [loading, setLoading] = useState(false);
    const [customer, setCustomer] = useState(props.data);

    // Check for user session
    const { data: session } = useSession({
        required: true,
        onUnauthenticated() {
            window.location.href = '/api/auth/signin';
        },
    }) as unknown as Session;

    // Return error if we don't have a customer
    if (props.data && Object.keys(props.data).length === 0) {
        return <Error statusCode={404} withDarkMode={false} />;
    }

    const saveCustomerButton = (
        <button
            className="col-sm-12 btn btn-primary"
            data-test-id="checkout-payment"
            type="submit"
        >
            Save customer
        </button>
    );

    async function saveCustomer(formData) {
        // Set spinner to loading
        setLoading(true);

        // Add the customer ID
        formData.id = customer.id;
        // fetch
        fetch('/api/customers/save', {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'x-user-id': session.user.id,
                'x-api-key': session.user.apiKey,
            },
            body: JSON.stringify(formData),
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
                setCustomer(data);

                toast('Customer updated', {
                    hideProgressBar: false,
                    autoClose: 2000,
                    type: 'success',
                });
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

    return (
        <Row>
            <Spinner loading={loading} />
            <Col className="mb-4" md={12}>
                <Breadcrumb>
                    <Breadcrumb.Item href="/admin/dashboard">
                        Home
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href="/admin/customers">
                        Customers
                    </Breadcrumb.Item>
                    <Breadcrumb.Item active>{customer.id}</Breadcrumb.Item>
                </Breadcrumb>
                <CustomerForm
                    button={saveCustomerButton}
                    customer={customer}
                    submitForm={saveCustomer}
                />
            </Col>
        </Row>
    );
};

export default Customer;
