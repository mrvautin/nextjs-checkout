import { expect, test } from '@playwright/test';

const waitTime = 0;

test('Process a Checkout e2e payment', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(waitTime);
    await page.getByTestId('Red Wing Iron Ranger Boot').click();
    await page.waitForTimeout(waitTime);
    await page.locator('.productVariant').selectOption('US10');
    await page.waitForTimeout(waitTime);
    await page.getByTestId('add-to-cart').click();
    await page.waitForTimeout(waitTime);
    await page.getByTestId('cart-toggle').click();
    await page.waitForTimeout(waitTime);
    await page.getByTestId('proceed-to-checkout').click();
    await page.waitForTimeout(waitTime);

    const customer = {
        email: 'test@test.com',
        phone: '0400000000',
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
    await page.getByTestId('checkout-customer-phone').fill(customer.phone);
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
    await page.locator('#cardNumber').fill('4111111111111111');
    await page.locator('#cardExpiry').fill('11/30');
    await page.locator('#cardCvc').fill('123');
    await page.locator('#billingName').fill('Timmy Smith');
    await page.locator('.SubmitButton').first().click();
    const resultText = await page.getByTestId('transaction-result').innerText();
    expect(resultText).toEqual('Transaction successful');
});

test('Add item to cart from product page', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('Red Wing Iron Ranger Boot').click();
    await page.locator('.productVariant').selectOption('US10');
    await page.getByTestId('add-to-cart').click();
    await page.getByTestId('cart-toggle').click();
    await expect(page.getByTestId('cart-items-empty')).toHaveCount(0);
});

test('Empty items from cart', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('Red Wing Iron Ranger Boot').click();
    await page.locator('.productVariant').selectOption('US10');
    await page.getByTestId('add-to-cart').click();
    await page.getByTestId('cart-toggle').click();
    await expect(page.getByTestId('cart-items-empty')).toHaveCount(0);
    await page.getByTestId('empty-cart').click();
    await page.getByTestId('cart-toggle').click();
    expect(await page.getByTestId('cart-items-empty')).toHaveCount(1);
});

test('Cart increase quantity', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('Red Wing Iron Ranger Boot').click();
    await page.locator('.productVariant').selectOption('US10');
    await page.getByTestId('add-to-cart').click();
    await page.getByTestId('cart-toggle').click();
    await expect(page.getByTestId('cart-items-empty')).toHaveCount(0);

    // Quantity checks
    const itemQuantity = await page
        .locator('.itemQuantity')
        .first()
        .inputValue();
    console.log('itemQuantity', itemQuantity);

    // Increase quantity
    await page.locator('.itemIncreaseQuantity').first().click();
    expect(await page.locator('.itemQuantity').first().inputValue()).toEqual(
        (parseInt(itemQuantity) + 1).toString(),
    );
});

test('Cart decrease quantity', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('Red Wing Iron Ranger Boot').click();
    await page.locator('.productVariant').selectOption('US10');
    await page.getByTestId('add-to-cart').click();
    await page.getByTestId('cart-toggle').click();
    await expect(page.getByTestId('cart-items-empty')).toHaveCount(0);
    await page.locator('.itemIncreaseQuantity').first().click();

    // Quantity checks
    const itemQuantity = await page
        .locator('.itemQuantity')
        .first()
        .inputValue();

    // Decrease quantity
    await page.locator('.itemReduceQuantity').first().click();
    expect(await page.locator('.itemQuantity').first().inputValue()).toEqual(
        (parseInt(itemQuantity) - 1).toString(),
    );
});

test('Cart decrease quantity to remove', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('Red Wing Iron Ranger Boot').click();
    await page.locator('.productVariant').selectOption('US10');
    await page.getByTestId('add-to-cart').click();
    await page.getByTestId('cart-toggle').click();
    await expect(page.getByTestId('cart-items-empty')).toHaveCount(0);

    // Increase quantity
    await page.locator('.itemReduceQuantity').first().click();
    await expect(page.getByTestId('cart-items-empty')).toHaveCount(1);
});

test('Add multiple values to cart', async ({ page }) => {
    // Add first item
    await page.goto('/');
    await page.getByTestId('Red Wing Iron Ranger Boot').click();
    await page.locator('.productVariant').selectOption('US10');
    await page.getByTestId('add-to-cart').click();

    // Add second item
    await page.goto('/');
    await page.getByTestId('5 panel camp hat').click();
    await page.locator('.productVariant').selectOption('Green');
    await page.getByTestId('add-to-cart').click();

    await page.getByTestId('cart-toggle').click();
    await expect(page.getByTestId('cart-items-empty')).toHaveCount(0);

    // Check items in count
    await expect(page.locator('.product-card')).toHaveCount(2);
});
