import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { Session } from '../lib/types';
import { toast } from 'react-toastify';

type Props = {
    showmodal: boolean;
    productId: string;
    onCancel: any;
    onConfirm: any;
};

const ModalVariant = (props: Props) => {
    const [showmodal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState({
        title: '',
        values: '',
    });

    useEffect(() => {
        setShowModal(props.showmodal);
    });

    // Check for user session
    const { data: session } = useSession({
        required: true,
        onUnauthenticated() {
            window.location.href = '/api/auth/signin';
        },
    }) as unknown as Session;

    const handleModalClose = () => {
        setShowModal(false);
        props.onCancel(true);
    };

    function handleConfirm() {
        // fetch
        fetch('/api/variants/save', {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'x-user-id': session.user.id,
                'x-api-key': session.user.apiKey,
            },
            body: JSON.stringify({
                title: modalData.title,
                values: modalData.values,
                productId: props.productId,
            }),
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                // Check for error
                if (data.error) {
                    toast(data.error, {
                        hideProgressBar: false,
                        autoClose: 2000,
                        type: 'error',
                    });
                    return;
                }
                toast('Variant added', {
                    hideProgressBar: false,
                    autoClose: 2000,
                    type: 'success',
                });
                setShowModal(false);
                props.onCancel(true);
                window.location.reload();
            })
            .catch(function (err) {
                toast(err.error, {
                    hideProgressBar: false,
                    autoClose: 2000,
                    type: 'error',
                });
            });
    }

    return (
        <Modal onHide={handleModalClose} show={showmodal}>
            <Modal.Header closeButton>
                <Modal.Title>New Variant</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                    >
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            autoFocus
                            onChange={event => {
                                setModalData({
                                    ...modalData,
                                    title: event.target.value,
                                });
                            }}
                            placeholder="Size"
                            type="text"
                            value={modalData.title}
                        />
                        <Form.Label>Values (comma seperated)</Form.Label>
                        <Form.Control
                            autoFocus
                            onChange={event => {
                                setModalData({
                                    ...modalData,
                                    values: event.target.value,
                                });
                            }}
                            placeholder="Small,Medium,Large"
                            type="text"
                            value={modalData.values}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleModalClose} variant="secondary">
                    Close
                </Button>
                <Button onClick={handleConfirm} variant="danger">
                    Confirm
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalVariant;
