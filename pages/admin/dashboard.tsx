import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { Col, Row } from 'react-bootstrap';
import Layout from '../../components/Layout';
import Cart from '../../components/Cart';
import NavAdmin from '../../components/NavAdmin';
import OrdersChart from '../../components/OrdersChart';
import CustomersChart from '../../components/CustomersChart';
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
        <Layout title="nextjs-checkout | Dashboard">
            <Cart>
                <NavAdmin />
                <h2>Dashboard</h2>
                <Row>
                    <Col sm={6} xs={12}>
                        <OrdersChart />
                    </Col>
                    <Col sm={6} xs={12}>
                        <CustomersChart />
                    </Col>
                </Row>
            </Cart>
        </Layout>
    );
};

export default DashboardPage;
