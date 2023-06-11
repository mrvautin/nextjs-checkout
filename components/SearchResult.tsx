/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { currency } from '../lib/helpers';

const SearchResult = () => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState<any>();
    const [searchResults, setSearchResults] = useState<any>();

    useEffect(() => {
        if (!router.isReady) {
            return;
        }

        searchProducts();
    }, [router.isReady]);

    function searchProducts() {
        const searchQuery = router.query.keyword;
        setSearchTerm(searchQuery);
        fetch('/api/search', {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                searchTerm: searchQuery,
            }),
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                setSearchResults(data);
            })
            .catch(function (err) {
                // There was an error
                console.log('Payload error:' + err);
            });
    }

    if (!searchResults) {
        return <></>;
    }

    return (
        <>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                <h5>
                    Showing {searchResults.length} results for &apos;
                    {searchTerm}&apos;
                </h5>
            </div>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                {searchResults.map(product => (
                    <div className="col" key={product.id}>
                        <div className="card product-card">
                            <Image
                                alt={product.images[0].attribution}
                                className="card-img-top"
                                height={300}
                                src={product.images[0].src}
                                style={{
                                    width: 'auto',
                                    height: 'auto',
                                }}
                                width={300}
                            />
                            <div className="card-body">
                                <div className="card-text">
                                    <Link
                                        className="link-secondary"
                                        href={'/product/' + product.permalink}
                                    >
                                        <h2 className="h4">{product.name}</h2>
                                    </Link>
                                    <span className="h6 text-danger">
                                        {currency(product.price / 100)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default SearchResult;
