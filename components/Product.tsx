/* eslint-disable react/no-danger-with-children */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Error from 'next/error';
import Spinner from '../components/Spinner';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { CartContext } from '../context/Cart';
import { toast } from 'react-toastify';
import { currency } from '../lib/helpers';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';

const Product = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState<any>();
    const { addItem } = useContext(CartContext);

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
                data.selectedVariants = [];
                for (const variant of data.variants) {
                    data.selectedVariants.push({
                        id: variant.id,
                        title: variant.title,
                        value: 'Select',
                    });
                }
                setProduct(data);
            })
            .catch(function (err) {
                // There was an error
                console.log('Payload error:' + err);
                toast('Unable to find product', {
                    hideProgressBar: true,
                    autoClose: 2000,
                    type: 'error',
                });
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

    // Get the current selected variant value
    const getVariantValue = id => {
        const variant = product.selectedVariants.find(value => value.id === id);
        if (!variant) {
            return;
        }
        return product.selectedVariants.find(value => value.id === id).value;
    };

    // Get variant options
    const variantOptions = (id, values) => {
        const options = [];
        for (const option of values) {
            options.push(<option key={id + '-' + option}>{option}</option>);
        }
        return options;
    };

    // Set the variant
    const variantSelect = (variant, value) => {
        // Update the variant value
        product.selectedVariants.find(value => value.id === variant.id).value =
            value;

        // Set the variant value to state
        setProduct({
            ...product,
            selectedVariants: product.selectedVariants,
        });
    };

    const productVariants = variants => {
        if (variants && variants.length > 0) {
            const variantElements = [];
            for (const variant of variants) {
                const variantValues = variant.values.split(',').map(item => {
                    return item.trim();
                });
                variantElements.push(
                    <div data-test-id={variant.id} key={variant.id}>
                        <h5 className="mb-2 text-muted">{variant.title}:</h5>
                        <Form.Select
                            className="mb-4 productVariant"
                            onChange={event =>
                                variantSelect(variant, event.target.value)
                            }
                            size="lg"
                            value={getVariantValue(variant.id)}
                        >
                            <option key={variant.id + '-select'}>Select</option>
                            {variantOptions(variant.id, variantValues)}
                        </Form.Select>
                    </div>,
                );
            }
            return variantElements;
        }
        return;
    };

    const addToCart = product => {
        let variantError = false;
        if (product.variants && product.variants.length > 0) {
            // Check if any variants are not set
            for (const selectedVariant of product.selectedVariants) {
                const variant = product.selectedVariants.find(
                    value => value.id === selectedVariant.id,
                );
                if (variant.value === 'Select') {
                    toast('Please select all product options', {
                        hideProgressBar: true,
                        autoClose: 2000,
                        type: 'error',
                    });
                    variantError = true;
                    break;
                }
            }
        }
        // Check for variant selection error
        if (!variantError) {
            addItem(product);
            toast('Cart updated', {
                hideProgressBar: true,
                autoClose: 2000,
                type: 'success',
            });
        }
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
                            addToCart(product);
                        }}
                        variant="primary"
                    >
                        ADD TO CART
                    </Button>{' '}
                </div>
                {productVariants(product.variants)}
                <div
                    className="fs-5"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                />
            </Col>
        </Row>
    );
};

export default Product;
