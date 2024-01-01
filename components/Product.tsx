/* eslint-disable react/no-danger-with-children */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Error from 'next/error';
import Spinner from '../components/Spinner';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useCart } from 'react-use-cart';
import { toast } from 'react-toastify';
import { currency } from '../lib/helpers';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';

const Product = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState<any>();
    const { addItem } = useCart();

    useEffect(() => {
        if (!router.isReady) {
            return;
        }
        const productPermalink = router.query.permalink;
        getProduct(productPermalink);
    }, [router.isReady]);

    function getProduct(permalink) {
        // fetch
        fetch('/api/product', {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                permalink: permalink,
            }),
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                setLoading(false);
                setProduct(data);
            })
            .catch(function (err) {
                // There was an error
                console.log('Payload error:' + err);
            });
    }

    // Check if product found
    if (!product) {
        return <Spinner loading={loading} />;
    }

    // Return error if we don't have a product
    if (product && Object.keys(product).length === 0) {
        return <Error statusCode={404} withDarkMode={false} />;
    }

    const productImage = images => {
        if (images && images.length > 0) {
            return (
                <Carousel>
                    {images.map((image, i) => (
                        <div key={i}>
                            <img alt={image.alt} src={image.url} />
                        </div>
                    ))}
                </Carousel>
            );
        }
        return (
            <img
                alt={'Product placeholder image'}
                className="img-fluid"
                src={'/placeholder.png'}
            />
        );
    };

    return (
        <Row>
            <Col className="mb-3" sm={6} xs={12}>
                <Row>
                    <Col className="mb-3" sm={12}>
                        {productImage(product.images)}
                    </Col>
                </Row>
            </Col>
            <Col sm={6} xs={12}>
                <h1 className="mb-4">{product.name}</h1>
                <h4 className="mb-4">
                    <span className="text-muted">Price:</span>{' '}
                    {currency(product.price / 100)}
                </h4>
                <div className="d-grid gap-2">
                    <Button
                        className="mb-3 p-3"
                        data-test-id="add-to-cart"
                        onClick={() => {
                            addItem(product);
                            toast('Cart updated', {
                                hideProgressBar: true,
                                autoClose: 2000,
                                type: 'success',
                            });
                        }}
                        variant="primary"
                    >
                        ADD TO CART
                    </Button>{' '}
                </div>
                <h5 className="mb-2 text-muted">Size:</h5>
                <Form.Select className="mb-4" size="lg">
                    <option>Small</option>
                    <option>Medium</option>
                    <option>Large</option>
                </Form.Select>
                <div
                    className="fs-5"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                />
            </Col>
        </Row>
    );
};

export default Product;
