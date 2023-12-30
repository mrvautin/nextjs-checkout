/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import Spinner from './Spinner';
import { NumericFormat } from 'react-number-format';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Session } from '../lib/types';

const DiscountNew = () => {
    const [loading, setLoading] = useState(false);
    const [discount, setDiscount] = useState({
        name: '',
        code: '',
        type: 'amount',
        value: 10,
        enabled: true,
        start_at: new Date(),
        end_at: new Date(),
    });

    // Check for user session
    const { data: session } = useSession({
        required: true,
        onUnauthenticated() {
            window.location.href = '/api/auth/signin';
        },
    }) as unknown as Session;

    function createDiscount() {
        setLoading(true);
        // fetch
        fetch('/api/discount/create', {
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

                toast('Discount created', {
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
        <>
            <Row>
                <Spinner loading={loading} />
                <Col className="text-end" sm={12} xs={12}>
                    <Button onClick={() => createDiscount()}>Create</Button>
                </Col>
            </Row>
            <Row>
                <Col className="g-3" sm={12}>
                    <Row>
                        <Col sm={12}>
                            <Row>
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
                                        placeholder="Discount name"
                                        value={discount.name}
                                    />
                                </Col>
                                <Col className="mt-3" xs={6}>
                                    <Form.Label className="fw-bold">
                                        Code
                                    </Form.Label>
                                    <input
                                        className="form-control"
                                        name="code"
                                        onChange={event =>
                                            setDiscount({
                                                ...discount,
                                                code: event.target.value,
                                            })
                                        }
                                        placeholder="DISCOUNT_CODE"
                                        value={discount.code}
                                    />
                                </Col>
                                <Col className="mt-3" xs={6}>
                                    <Form.Label className="fw-bold">
                                        Type
                                    </Form.Label>
                                    <select
                                        className="form-control"
                                        name="type"
                                        onChange={event =>
                                            setDiscount({
                                                ...discount,
                                                type: event.target.value,
                                            })
                                        }
                                        value={discount.type}
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
                                                value: parseInt(
                                                    event.target.value,
                                                ),
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
                                        value={discount.enabled.toString()}
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

export default DiscountNew;
