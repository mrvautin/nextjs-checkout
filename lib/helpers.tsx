/* eslint-disable import/no-anonymous-default-export */
import { schemas } from './schemas';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

ajv.addKeyword({
    keyword: 'isNotEmpty',
    type: 'string',
    schemaType: 'boolean',
    compile: () => data => {
        return data.trim() !== '';
    },
});

export function currency(amount) {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: process.env.NEXT_PUBLIC_PAYMENT_CURRENCY,
    });
    return formatter.format(amount);
}

export function removeCurrency(price) {
    price = price.replace('$', '');
    price = price.replace('.', '');
    return price;
}

export function calculateCartTotal(cartTotal, cartMeta) {
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

export function validateSchema(schema, data) {
    const validated = ajv.validate(schemas[schema], data);
    return {
        valid: validated,
        errors: ajv.errors,
    };
}

export default {
    currency,
};
