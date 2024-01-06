import React, { MouseEvent, useContext } from 'react';
import Link from 'next/link';
import { CartContext } from '../context/Cart';
import { useLocalStorage } from 'usehooks-ts';
import { Shop } from 'react-bootstrap-icons';
import { Button, Container, Navbar } from 'react-bootstrap';
import Search from './Search';

const Nav = () => {
    const [cartState, setCartState] = useLocalStorage('cartSidebarState', true);
    const { totalItems } = useContext(CartContext);

    const toggleSideCart = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setCartState(() => !cartState);
    };

    return (
        <>
            <Navbar className="mb-3 border-bottom" expand={false}>
                <Container className="p-0" fluid>
                    <Link
                        className="d-flex align-items-center link-body-emphasis text-decoration-none"
                        href="/"
                    >
                        <Shop className="me-3 text-primary" size={40} />
                        <span className="fs-4">nextjs-checkout</span>
                    </Link>
                    <Search className="d-none d-sm-block" />
                    <Button
                        data-test-id="cart-toggle"
                        onClick={toggleSideCart}
                        type="button"
                        variant="primary"
                    >
                        Cart{' '}
                        <span
                            className="badge bg-dark"
                            suppressHydrationWarning
                        >
                            {totalItems()}
                        </span>
                    </Button>
                </Container>
            </Navbar>
            <Search className="d-block d-sm-none mb-3" />
        </>
    );
};

export default Nav;
