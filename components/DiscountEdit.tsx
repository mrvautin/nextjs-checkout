/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import Error from 'next/error';
import { useRouter } from 'next/navigation';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Spinner from './Spinner';
import { format } from 'date-fns';
import { NumericFormat } from 'react-number-format';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useSession } from 'next-auth/react';
import { Session } from '../lib/types';

const DiscountEdit = props => {
    const { push } = useRouter();
    const [loading, setLoading] = useState(false);
    const [discount, setDiscount] = useState(props.discount);

    // Check for user session
    const { data: session } = useSession({
        required: true,
        onUnauthenticated() {
            window.location.href = '/api/auth/signin';
        },
    }) as unknown as Session;

    // Check for discount
    if (!discount) {
        return <Error statusCode={404} withDarkMode={false} />;
    }

    function saveDiscount() {
        setLoading(true);
        // fetch
        fetch('/api/discount/save', {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'x-user-id': session.user.id,
                'x-api-key': session.user.apiKey,
            },
            body: JSON.stringify(discount),
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
                setDiscount(data);

                toast('Discount updated', {
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

    function deleteDiscount() {
        setLoading(true);
        // fetch
        fetch('/api/discount/delete', {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'x-user-id': session.user.id,
                'x-api-key': session.user.apiKey,
            },
            body: JSON.stringify(discount),
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

                toast('Discount deleted', {
                    hideProgressBar: false,
                    autoClose: 2000,
                    type: 'success',
                });
                push('/admin/discounts');
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
        <>
            <Row>
                <Spinner loading={loading} />
                <Col className="text-end" sm={12} xs={12}>
                    <Button
                        className="me-1"
                        onClick={() => deleteDiscount()}
                        variant="danger"
                    >
                        Delete
                    </Button>
                    <Button onClick={() => saveDiscount()}>Save</Button>
                </Col>
            </Row>
            <Row>
                <Col className="g-3" sm={12}>
                    <Row>
                        <Col sm={12}>
                            <Row>
                                <Col xs={6}>
                                    <Form.Label className="fw-bold">
                                        Discount Id
                                    </Form.Label>
                                    <div className="form-control">
                                        {discount.id}
                                    </div>
                                </Col>
                                <Col xs={6}>
                                    <Form.Label className="fw-bold">
                                        Created
                                    </Form.Label>
                                    <div className="form-control">
                                        {format(
                                            new Date(discount.created_at),
                                            'dd/MM/yyyy KK:mmaaa',
                                        )}
                                    </div>
                                </Col>
                                <Col className="mt-3" xs={6}>
                                    <Form.Label className="fw-bold">
                                        Name
                                    </Form.Label>
                                    <input
                                        className="form-control"
                                        name="Name"
                                        onChange={event =>
                                            setDiscount({
                                                ...discount,
                                                name: event.target.value,
                                            })
                                        }
                                        value={discount.name}
                                    />
                                </Col>
                                <Col className="mt-3" xs={6}>
                                    <Form.Label className="fw-bold">
                                        Code
                                    </Form.Label>
                                    <input
                                        className="form-control"
                                        name="permalink"
                                        onChange={event =>
                                            setDiscount({
                                                ...discount,
                                                code: event.target.value,
                                            })
                                        }
                                        value={discount.code}
                                    />
                                </Col>
                                <Col className="mt-3" xs={6}>
                                    <Form.Label className="fw-bold">
                                        Type
                                    </Form.Label>
                                    <select
                                        className="form-control"
                                        onChange={event =>
                                            setDiscount({
                                                ...discount,
                                                type: event.target.value,
                                            })
                                        }
                                        value={discount.enabled}
                                    >
                                        <option value="amount">Amount</option>
                                        <option value="percent">Percent</option>
                                    </select>
                                </Col>
                                <Col className="mt-3" xs={6}>
                                    <Form.Label className="fw-bold">
                                        Value
                                    </Form.Label>
                                    <NumericFormat
                                        allowNegative={false}
                                        className="form-control"
                                        decimalScale={2}
                                        fixedDecimalScale
                                        onChange={event =>
                                            setDiscount({
                                                ...discount,
                                                value: event.target.value,
                                            })
                                        }
                                        value={discount.value}
                                    />
                                </Col>
                                <Col className="mt-3" xs={6}>
                                    <Form.Label className="fw-bold">
                                        Status
                                    </Form.Label>
                                    <select
                                        className="form-control"
                                        onChange={event =>
                                            setDiscount({
                                                ...discount,
                                                // eslint-disable-next-line prettier/prettier
                                                enabled: (event.target.value === 'true'),
                                            })
                                        }
                                        value={discount.enabled}
                                    >
                                        <option value="true">Enabled</option>
                                        <option value="false">Disabled</option>
                                    </select>
                                </Col>
                                <Col className="mt-3" xs={3}>
                                    <Form.Label className="fw-bold">
                                        Starts at
                                    </Form.Label>
                                    <br />
                                    <DatePicker
                                        className="form-control"
                                        closeOnSelect={true}
                                        dateFormat="dd/MM/yyyy HH:mm:ss"
                                        input={false}
                                        onChange={date =>
                                            setDiscount({
                                                ...discount,
                                                start_at: date,
                                            })
                                        }
                                        onKeyDown={e => e.preventDefault()}
                                        selected={new Date(discount.start_at)}
                                        showTimeSelect
                                    />
                                </Col>
                                <Col className="mt-3" xs={3}>
                                    <Form.Label className="fw-bold">
                                        Ends at
                                    </Form.Label>
                                    <br />
                                    <DatePicker
                                        className="form-control"
                                        closeOnSelect={true}
                                        dateFormat="dd/MM/yyyy HH:mm:ss"
                                        onChange={date =>
                                            setDiscount({
                                                ...discount,
                                                end_at: date,
                                            })
                                        }
                                        onKeyDown={e => e.preventDefault()}
                                        selected={new Date(discount.end_at)}
                                        showTimeSelect
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    );
};

export default DiscountEdit;
