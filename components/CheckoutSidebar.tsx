/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { useContext, useEffect } from 'react';
import CartItems from '../components/CartItems';
import { CartContext } from '../context/Cart';
import Link from 'next/link';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Button } from 'react-bootstrap';
import { Trash3 } from 'react-bootstrap-icons';
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts';

const CheckoutSidebar = () => {
    const [cartState, setCartState] = useLocalStorage<boolean>(
        'cartSidebarState',
        useReadLocalStorage('cartSidebarState'),
    );
    const { items, emptyCart } = useContext(CartContext);

    useEffect(() => {
        setCartState(false);
    }, []);

    const closeHandler = () => setCartState(!cartState);
    const emptyHandler = () => {
        emptyCart();
        setCartState(false);
    };

    function cart() {
        if (items.length > 0) {
            return renderCart();
        }
        return <h5 data-test-id="cart-items-empty">No items in cart</h5>;
    }

    function renderCart() {
        return (
            <>
                <CartItems type="checkout" />
                <div className="d-grid gap-2">
                    <Link
                        className="mt-5 p-3 btn btn-primary"
                        data-test-id="proceed-to-checkout"
                        href="/checkout"
                    >
                        Proceed to Checkout
                    </Link>{' '}
                </div>
                <div className="text-end">
                    <Button
                        className="btn-sm mt-5 text-right"
                        data-test-id="empty-cart"
                        onClick={emptyHandler}
                        variant="danger"
                    >
                        <Trash3 className="mb-1" /> Empty Cart
                    </Button>{' '}
                </div>
            </>
        );
    }

    return (
        <>
            <Offcanvas placement="end" show={cartState}>
                <Offcanvas.Header closeButton onClick={closeHandler}>
                    <h2>Cart</h2>
                </Offcanvas.Header>
                <Offcanvas.Body>{cart()}</Offcanvas.Body>
            </Offcanvas>
        </>
    );
};

export default CheckoutSidebar;
