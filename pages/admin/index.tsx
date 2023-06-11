import React from 'react';
import { NextPage } from 'next';
import { useSession } from 'next-auth/react';

const IndexPage: NextPage = () => {
    const { data: session } = useSession();
    if (session === undefined) {
        return <></>;
    }
    if (!session) {
        window.location.href = '/api/auth/signin';
        return;
    }
    window.location.href = '/admin/dashboard';
};

export default IndexPage;
