/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button, Col, Form, ListGroup, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import SortableList, { SortableItem } from 'react-easy-sort';
import { ArrowsMove, Trash } from 'react-bootstrap-icons';
import { arrayMoveImmutable } from 'array-move';
import Spinner from '../components/Spinner';
import PopUpConfirm from '../components/Modal';

type Props = {
    product: any;
};

const ProductImages = (props: Props) => {
    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState(props.product);
    const [imageId, setImageId] = useState();
    const [showModal, setShowModal] = useState(false);
    const productId = props.product.id;

    const { getRootProps } = useDropzone({
        multiple: false,
        onDrop: e => {
            uploadImage(e[0]);
        },
    });

    const uploadImage = async file => {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('productId', productId);
        try {
            fetch('/api/dashboard/files/upload', {
                method: 'POST',
                body: formData,
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

                    // Stop spinner
                    setLoading(false);

                    // Update product
                    setProduct(data);

                    toast('Image uploaded', {
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
        } catch (error) {
            // Stop the spinner
            setLoading(false);
            // Show the error
            if (error.response && error.response.data) {
                toast(error.response.data.message, {
                    hideProgressBar: false,
                    autoClose: 2000,
                    type: 'error',
                });
                return;
            }
            return toast('Unable to upload file', {
                hideProgressBar: false,
                autoClose: 2000,
                type: 'error',
            });
        }
    };

    const removeImage = async imageId => {
        // Start spinner
        setLoading(true);
        try {
            fetch(`/api/dashboard/files/remove/${imageId}`, {
                method: 'DELETE',
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

                    // Stop spinner
                    setLoading(false);

                    // Update product
                    setProduct(data);

                    toast('Image deleted', {
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
        } catch (error) {
            // Stop the spinner
            setLoading(false);
            // Show the error
            if (error.response && error.response.data) {
                toast(error.response.data.message, {
                    hideProgressBar: false,
                    autoClose: 2000,
                    type: 'error',
                });
                return;
            }
            return toast('Unable to delete file', {
                hideProgressBar: false,
                autoClose: 2000,
                type: 'error',
            });
        }
    };

    const onSortEnd = async (oldIndex, newIndex) => {
        // Start spinner
        setLoading(true);

        const productImages = product.images;
        const newOrder = arrayMoveImmutable(productImages, oldIndex, newIndex);
        setProduct({
            ...product,
            images: newOrder,
        });
        await fetch('/api/dashboard/files/sort', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                images: newOrder,
            }),
        });

        // Stop spinner
        setLoading(false);

        // Show message
        toast('Images sorted', {
            hideProgressBar: false,
            autoClose: 2000,
            type: 'success',
        });
    };

    return (
        <Col className="mt-3" xs={12}>
            <Spinner loading={loading} />
            <PopUpConfirm
                modalText="Are you sure you want to delete this image?"
                modalTitle="Please confirm"
                onCancel={() => {
                    setShowModal(false);
                }}
                onConfirm={() => {
                    removeImage(imageId);
                }}
                showmodal={showModal}
            />
            <Form.Label className="fw-bold">Images</Form.Label>
            <div
                {...getRootProps({
                    className: 'dropzone',
                })}
            >
                Drop images here
            </div>
            <ListGroup className="mt-3">
                <SortableList
                    className="list"
                    draggedItemClassName="dragged"
                    onSortEnd={onSortEnd}
                >
                    {product.images.map((image, i) => (
                        <SortableItem key={image.id}>
                            <ListGroup.Item as="li" key={i}>
                                <Row
                                    style={{
                                        minHeight: 80,
                                        maxHeight: 80,
                                        height: 80,
                                    }}
                                >
                                    <Col xs={8}>
                                        <ArrowsMove
                                            className="mt-4 text-primary"
                                            size={25}
                                        />
                                    </Col>
                                    <Col xs={2}>
                                        <img
                                            className="img-fluid"
                                            src={image.url}
                                        />
                                    </Col>
                                    <Col xs={2}>
                                        <Button
                                            className="mt-3"
                                            onClick={() => {
                                                setImageId(image.id);
                                                setShowModal(true);
                                            }}
                                            variant="danger"
                                        >
                                            <Trash
                                                className="text-end"
                                                size={15}
                                            />
                                        </Button>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        </SortableItem>
                    ))}
                </SortableList>
            </ListGroup>
        </Col>
    );
};

export default ProductImages;
