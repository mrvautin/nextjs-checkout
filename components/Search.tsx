import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Form, InputGroup } from 'react-bootstrap';

type Props = {
    className?: string;
};

const Search = (props: Props) => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        if (!router.isReady) {
            return;
        }

        // If search term in param, set input
        const searchQuery = router.query.keyword;
        if (searchQuery && searchQuery !== '') {
            setSearchTerm(searchQuery.toString());
        }
    }, [router.isReady]);

    // Redirect to our search term
    function searchProducts() {
        if (searchTerm.trim() === '') {
            window.location.href = '/';
            return;
        }
        window.location.href = `/search/${encodeURI(searchTerm)}`;
    }

    return (
        <div className={props.className}>
            <InputGroup className="">
                <Form.Control
                    aria-label="Search..."
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search products..."
                    value={searchTerm}
                />
                <Button
                    id="searchButton"
                    onClick={searchProducts}
                    variant="outline-primary"
                >
                    Search
                </Button>
            </InputGroup>
        </div>
    );
};

export default Search;
