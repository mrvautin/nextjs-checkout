/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Spinner from '../components/Spinner';
import { CartContext } from '../context/Cart';
import { toast } from 'react-toastify';
import { currency } from '../lib/helpers';

const Products = () => {
    const router = useRouter();
    const { addItem } = useContext(CartContext);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<any>();

    useEffect(() => {
        if (!router.isReady) {
            return;
        }

        getProducts();
    }, [router.isReady]);

    function getProducts() {
        // fetch
        fetch('/api/products', {
            method: 'GET',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                setLoading(false);
                setProducts(data);
            })
            .catch(function (err) {
                // There was an error
                console.log('Payload error:' + err);
            });
    }

    // Check if product found
    if (!products) {
        return <Spinner loading={loading} />;
    }

    const addToCart = product => {
        if (product.variants && product.variants.length === 0) {
            return (
                <button
                    className="btn btn-dark"
                    onClick={() => {
                        addItem(product);
                        toast('Cart updated', {
                            hideProgressBar: false,
                            autoClose: 2000,
                            type: 'success',
                        });
                    }}
                >
                    Add to cart
                </button>
            );
        }
        return (
            <Link
                className="btn btn-dark"
                data-test-id={product.name + '-btn'}
                href={'/product/' + product.permalink}
            >
                View product
            </Link>
        );
    };

    const productImage = product => {
        if (product.images && product.images.length > 0) {
            return (
                <img
                    alt={product.images[0].alt}
                    className="card-img-top"
                    height={300}
                    src={product.images[0].url}
                    style={{
                        width: 'auto',
                        height: 'auto',
                    }}
                    width={300}
                />
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
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            {products.map(product => (
                <div className="col" key={product.id}>
                    <div className="card product-card">
                        {productImage(product)}
                        <div className="card-body">
                            <div className="card-text">
                                <Link
                                    className="link-secondary"
                                    data-test-id={product.name}
                                    href={'/product/' + product.permalink}
                                >
                                    <h2 className="h4">{product.name}</h2>
                                </Link>
                                <span className="h6 text-danger">
                                    {currency(product.price / 100)}
                                </span>
                                <p>{product.summary}</p>
                            </div>
                            <div className="d-flex justify-content-between ">
                                <div className="btn-group flex-fill">
                                    {addToCart(product)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Products;
