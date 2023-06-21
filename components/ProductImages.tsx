/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Col, Form, ListGroup, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { Image } from 'react-bootstrap-icons';
import Spinner from '../components/Spinner';

type Props = {
    product: any;
};

const ProductImages = (props: Props) => {
    const [loading, setLoading] = useState(false);
    const [uploadHover, setUploadHover] = useState('');
    const [product, setProduct] = useState(props.product);
    const productId = props.product.id;

    const { getRootProps } = useDropzone({
        multiple: false,
        onDrop: e => {
            uploadImage(e[0]);
        },
        onDragOver: () => {
            setUploadHover('imageDropHover');
        },
        onDragLeave: () => {
            setUploadHover('');
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
                        alert('Payload error:' + data.error);
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
                    alert('Payload error:' + err.error);
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

    return (
        <Col className={'mt-3' + uploadHover} xs={12}>
            <Spinner loading={loading} />
            <Form.Label className="fw-bold">Images</Form.Label>
            <div
                {...getRootProps({
                    className: 'dropzone',
                })}
            >
                <ListGroup>
                    {product.images.map((image, i) => (
                        <ListGroup.Item as="li" key={i}>
                            <Row>
                                <Col xs={10}>
                                    <Image
                                        className="mt-4 text-primary"
                                        size={30}
                                    />
                                </Col>
                                <Col xs={2}>
                                    <img
                                        className="img-fluid"
                                        src={image.url}
                                    />
                                </Col>
                            </Row>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </div>
        </Col>
    );
};

export default ProductImages;
