import React, { ReactNode } from 'react';
import Head from 'next/head';

type Props = {
    children: ReactNode;
    title?: string;
};

const Layout = ({
    children,
    title = 'nextjs-checkout | A Next.js Shopping cart',
}: Props) => (
    <>
        <Head>
            <title>{title}</title>
            <meta charSet="utf-8" />
            <meta
                content="initial-scale=1.0, width=device-width"
                name="viewport"
            />
            <meta
                content="nextjs-checkout | A Next.js Shopping cart"
                name="twitter:description"
            />
            <link href="/favicon.png" rel="icon" type="image/png" />
        </Head>
        <div className="container">{children}</div>
    </>
);

export default Layout;
