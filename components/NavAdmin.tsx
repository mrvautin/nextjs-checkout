import React from 'react';
import Link from 'next/link';
import { Shop } from 'react-bootstrap-icons';
import { signOut, useSession } from 'next-auth/react';
import { Container, Navbar, NavDropdown } from 'react-bootstrap';
import { MenuButtonWide } from 'react-bootstrap-icons';
import Search from './Search';
import { Session } from '../lib/types';

const NavAdmin = () => {
    const { data: session } = useSession({
        required: true,
        onUnauthenticated() {
            window.location.href = '/api/auth/signin';
        },
    }) as unknown as Session;

    // Check if session is retrieved
    if (session === undefined) {
        return <></>;
    }

    function loggedIn() {
        if (!session) {
            return;
        }
        return (
            <>
                <NavDropdown
                    align="end"
                    id="basic-nav-dropdown"
                    title={
                        <MenuButtonWide className="text-primary" size={25} />
                    }
                >
                    <NavDropdown.Item href="/admin/dashboard">
                        Dashboard
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/admin/products">
                        Products
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/admin/orders">
                        Orders
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/admin/customers">
                        Customers
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/admin/discounts">
                        Discounts
                    </NavDropdown.Item>
                    <NavDropdown.Item href={'/admin/user/' + session.user.id}>
                        User
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#" onClick={() => signOut()}>
                        Logout
                    </NavDropdown.Item>
                </NavDropdown>
            </>
        );
    }

    return (
        <>
            <Navbar className="mb-3 border-bottom" expand={false}>
                <Container className="p-0" fluid>
                    <Link
                        className="d-flex align-items-center link-body-emphasis text-decoration-none"
                        href="/admin/dashboard"
                    >
                        <Shop className="me-3 text-primary" size={40} />
                        <span className="fs-4">nextjs-checkout</span>
                    </Link>
                    {loggedIn()}
                </Container>
            </Navbar>
            <Search className="d-block d-sm-none mb-3" />
        </>
    );
};

export default NavAdmin;
