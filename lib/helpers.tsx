/* eslint-disable import/no-anonymous-default-export */

export function currency(amount) {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: process.env.NEXT_PUBLIC_PAYMENT_CURRENCY,
    });
    return formatter.format(amount);
}

export default {
    currency,
};
