import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Layout from '../../components/Layout';
import Cart from '../../components/Cart';
import NavAdmin from '../../components/NavAdmin';
import Spinner from '../../components/Spinner';

const DashboardPage: NextPage = () => {
    // Check for user session
    const { status } = useSession({
        required: true,
        onUnauthenticated() {
            window.location.href = '/api/auth/signin';
        },
    });
    if (status === 'loading') {
        return <Spinner loading={true} />;
    }

    return (
        <Layout title="Shopping Cart | Dashboard">
            <Cart>
                <NavAdmin />
                <h2>Dashboard</h2>
            </Cart>
        </Layout>
    );
};

export default DashboardPage;
