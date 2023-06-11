import { expect, test } from '@playwright/test';

const typeSpeed = 50;
const waitTime = 0;

test('Process a Checkout e2e payment', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(waitTime);
    await page.getByTestId('Red Wing Iron Ranger Boot').click();
    await page.waitForTimeout(waitTime);
    await page.getByTestId('add-to-cart').click();
    await page.waitForTimeout(waitTime);
    await page.getByTestId('cart-toggle').click();
    await page.waitForTimeout(waitTime);
    await page.getByTestId('proceed-to-checkout').click();
    await page.waitForTimeout(waitTime);

    const customer = {
        email: 'test@test.com',
        firstName: 'Timmy',
        lastName: 'Smith',
        address1: '1 Test Street',
        suburb: 'Sydney',
        state: 'NSW',
        postcode: '2000',
        country: 'AU',
    };

    // Type in customer
    await page.getByTestId('checkout-customer-email').fill(customer.email);
    await page
        .getByTestId('checkout-customer-firstname')
        .fill(customer.firstName);
    await page
        .getByTestId('checkout-customer-lastname')
        .fill(customer.lastName);
    await page
        .getByTestId('checkout-customer-address1')
        .fill(customer.address1);
    await page.getByTestId('checkout-customer-suburb').fill(customer.suburb);
    await page
        .getByTestId('checkout-customer-state')
        .selectOption(customer.state);
    await page
        .getByTestId('checkout-customer-postcode')
        .fill(customer.postcode);
    await page
        .getByTestId('checkout-customer-australia')
        .selectOption(customer.country);

    // Checkout to payment
    await page.getByTestId('checkout-payment').click();
    await page.getByPlaceholder('Your card number').click();
    await page
        .getByPlaceholder('Your card number')
        .type('4111', { delay: typeSpeed });
    await page
        .getByPlaceholder('Your card number')
        .type('1111', { delay: typeSpeed });
    await page
        .getByPlaceholder('Your card number')
        .type('1111', { delay: typeSpeed });
    await page
        .getByPlaceholder('Your card number')
        .type('1111', { delay: typeSpeed });
    await page.waitForTimeout(1500);
    await page.getByPlaceholder('MM/YY').click();
    await page.getByPlaceholder('MM/YY').fill('12/25');
    await page.waitForTimeout(waitTime);
    await page.getByPlaceholder('CVV').click();
    await page.getByPlaceholder('CVV').fill('123');
    await page.waitForTimeout(2000);
    await page.locator('[data-e2e="card-form-submit"]').click();
    await page.getByRole('button', { name: 'Continue back to store' }).click();
    await page.waitForTimeout(2000);
    const resultText = await page.getByTestId('transaction-result').innerText();
    expect(resultText).toEqual('Transaction successful');
});

test('Add item to cart from product page', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('Red Wing Iron Ranger Boot').click();
    await page.getByTestId('add-to-cart').click();
    await page.getByTestId('cart-toggle').click();
    expect(await page.getByTestId('cart-items-empty').count()).toEqual(0);
});

test('Empty items from cart', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('Red Wing Iron Ranger Boot').click();
    await page.getByTestId('add-to-cart').click();
    await page.getByTestId('cart-toggle').click();
    expect(await page.getByTestId('cart-items-empty').count()).toEqual(0);
    await page.getByTestId('empty-cart').click();
    await page.getByTestId('cart-toggle').click();
    expect(await page.getByTestId('cart-items-empty').count()).not.toEqual(0);
});
