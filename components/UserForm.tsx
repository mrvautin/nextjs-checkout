/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import Spinner from './Spinner';
import { toast } from 'react-toastify';
import Error from 'next/error';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import PopUpConfirm from '../components/Modal';

const UserForm = props => {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(props.user);
    if (!user) {
        return <Error statusCode={404} withDarkMode={false} />;
    }

    function saveUser() {
        setLoading(true);
        // fetch
        fetch('/api/user/update', {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
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

                toast('User saved', {
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

    function generateApiKey() {
        const newKey = uuidv4();
        setUser({
            ...user,
            apiKey: newKey,
        });
    }

    return (
        <>
            <Row>
                <Spinner loading={loading} />
                <PopUpConfirm
                    modalText="Are you sure? This may break your API integration."
                    modalTitle="Please confirm"
                    onCancel={() => {
                        setShowModal(false);
                    }}
                    onConfirm={() => {
                        saveUser();
                    }}
                    showmodal={showModal}
                />
                <Col className="text-end" sm={12} xs={12}>
                    <Button
                        onClick={() => {
                            setShowModal(true);
                        }}
                    >
                        Save
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col className="g-3" sm={12} xs={12}>
                    <Row>
                        <Col sm={12}>
                            <Row>
                                <Col className="mt-3" xs={6}>
                                    <Form.Label>Date</Form.Label>
                                    <input
                                        className="form-control"
                                        disabled
                                        name="Date"
                                        readOnly
                                        value={user.name}
                                    />
                                </Col>
                                <Col className="mt-3" xs={6}>
                                    <Form.Label>Enabled</Form.Label>
                                    <input
                                        className="form-control"
                                        disabled
                                        name="Status"
                                        readOnly
                                        value={user.enabled}
                                    />
                                </Col>
                                <Col className="mt-3" xs={6}>
                                    <Form.Label>User Id</Form.Label>
                                    <input
                                        className="form-control"
                                        disabled
                                        name="id"
                                        readOnly
                                        value={user.id}
                                    />
                                </Col>
                                <Col xs={6}>
                                    <Form.Label className="mt-3">
                                        API Key
                                    </Form.Label>
                                    <div className="input-group mb-3">
                                        <input
                                            className="form-control"
                                            disabled
                                            name="apiKey"
                                            readOnly
                                            value={user.apiKey}
                                        />
                                        <button
                                            className="btn btn-danger"
                                            id="button-addon2"
                                            onClick={() => generateApiKey()}
                                            type="button"
                                        >
                                            Generate
                                        </button>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    );
};

export default UserForm;
