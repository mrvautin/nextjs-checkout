import React, { Fragment, ReactNode, useEffect, useState } from 'react';
import { CartProvider as BaseCartProvider } from 'react-use-cart';

const Cart = ({ children }: { children: ReactNode }) => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true));

    if (mounted) {
        return (
            <main>
                <BaseCartProvider>{children}</BaseCartProvider>
            </main>
        );
    }

    return (
        <main>
            <Fragment>{children}</Fragment>
        </main>
    );
};

export default Cart;
