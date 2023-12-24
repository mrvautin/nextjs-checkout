/* eslint-disable import/no-anonymous-default-export */
export function currency(amount) {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: process.env.NEXT_PUBLIC_PAYMENT_CURRENCY,
    });
    return formatter.format(amount);
}

export function calculateCartTotal(cartTotal, cartMeta) {
    // Calculate any discounts
    cartTotal = calculateDiscount(cartTotal, cartMeta);
    return cartTotal;
}

export function calculateDiscount(cartTotal, cartMeta) {
    if (cartMeta.discount) {
        if (cartMeta.discount.type === 'amount') {
            cartTotal = cartTotal - cartMeta.discount.value;
        }
        if (cartMeta.discount.type === 'percent') {
            const discountAmount = cartTotal * (cartMeta.discount.value / 100);
            cartTotal = cartTotal - discountAmount;
        }
    }
    return cartTotal;
}

export default {
    currency,
};
