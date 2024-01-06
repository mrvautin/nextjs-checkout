import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { CartProvider } from '../context/Cart';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles.css';

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
    return (
        <SessionProvider session={session}>
            <CartProvider>
                <Component {...pageProps} />
                <ToastContainer />
            </CartProvider>
        </SessionProvider>
    );
}

export default App;
