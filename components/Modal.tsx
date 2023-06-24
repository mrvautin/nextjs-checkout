import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

type Props = {
    showmodal: boolean;
    modalTitle: string;
    modalText: string;
    onCancel: any;
    onConfirm: any;
};

const PopUpConfirm = (props: Props) => {
    const [showmodal, setShowModal] = useState(false);

    useEffect(() => {
        setShowModal(props.showmodal);
    });
    const handleModalClose = () => {
        setShowModal(false);
        props.onCancel(true);
    };
    const handleConfirm = () => {
        props.onConfirm();
        props.onCancel(true);
    };

    return (
        <Modal onHide={handleModalClose} show={showmodal}>
            <Modal.Header closeButton>
                <Modal.Title>{props.modalTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <h6>{props.modalText}</h6>
                </div>
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

export default PopUpConfirm;
