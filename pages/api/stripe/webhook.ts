import Stripe from 'stripe';
import { NextApiRequest, NextApiResponse } from 'next';
import { getOrderByCheckout, updateOrder } from '../../../lib/orders';

// Define Types
type stripeOrder = {
    id: string;
    payment_status: string;
    metadata: {
        orderId: string;
    };
    amount_total: number;
};

type Order = {
    id: string;
    totalAmount: number;
};

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse,
): Promise<void> => {
    const stripe = new Stripe(process.env.STRIPE_WEBHOOK_SECRET, {
        apiVersion: '2022-11-15',
    });

    const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET;

    // Only accept POST
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
        return;
    }

    // Get the Stripe sig
    const sig = req.headers['stripe-signature'];

    let event: Stripe.Event;
    try {
        const body = await buffer(req);
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err) {
        // On error, log and return the error message
        console.log(`❌ Error message: ${err.message}`);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Check event type is what we are waiting for, else return
    if (event.type !== 'checkout.session.completed') {
        console.log('here?', event.type);
        res.json({ received: true });
        return;
    }

    // Get Checkout ID
    const checkoutId = event.data.object.id;

    // Get order
    const order = (await getOrderByCheckout(checkoutId)) as Order;

    // Check order is found
    if (!order) {
        return res
            .status(400)
            .json({ error: `Order not found: ${checkoutId}` });
    }

    const stripeOrder = event.data.object as stripeOrder;

    // Setup status from hook
    let status = '';
    let paid;
    if (stripeOrder.payment_status === 'paid') {
        status = 'COMPLETED';
        paid = true;
    } else {
        status = 'FAILED';
        paid = false;
    }

    /*
        If the values of the checkout don't match the DB, we 
        override the `status` and `paid` values with a validation
        error and update the DB
    */

    // Validate the orderId to order.id
    if (stripeOrder.metadata.orderId !== order.id) {
        console.log('didnt validate orderId');
        status = 'FAILED VALIDATION';
        paid = false;
    }

    // Validate the amount to order.amount
    if (stripeOrder.amount_total !== order.totalAmount) {
        console.log('didnt validate amount');
        status = 'FAILED VALIDATION';
        paid = false;
    }

    console.log(`Checkout received - Status: ${status}, Paid: ${paid}`);

    // Update the order with the status of the hook
    await updateOrder(order.id, {
        status,
        paid,
    });

    // Return a response to acknowledge receipt of the event
    res.json({ received: true });
};

export const config = {
    api: {
        bodyParser: false,
    },
};

const buffer = (req: NextApiRequest) => {
    return new Promise<Buffer>((resolve, reject) => {
        const chunks: Buffer[] = [];

        req.on('data', (chunk: Buffer) => {
            chunks.push(chunk);
        });

        req.on('end', () => {
            resolve(Buffer.concat(chunks));
        });

        req.on('error', reject);
    });
};

export default handler;
