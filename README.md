# nextjs-checkout

A superfast shopping cart built with [Next.js](https://nextjs.org/) and [Prisma](https://www.prisma.io). Supports [Stripe](https://stripe.com/) and [Verifone](https://verifone.cloud/) payment gateways + the addition of payment gateways using modular design.

![nextjs-checkout screenshot](https://nextjs-checkout.markmoffat.com/screenshot.jpg)

## Demo

You can see a working demo here: [https://nextjs-checkout.markmoffat.com](https://nextjs-checkout.markmoffat.com)

## Development

### Installing

Run command: `yarn install`

### Starting dev

Run command: `yarn run dev`

### Building

Run command: `yarn run build`

### Testing

Run command: `yarn run test`

### Linting

Run command: `yarn run lint`

## Config

`nextjs-checkout` uses [Next.js](https://nextjs.org/) config which uses `.env` files.

This means you able able to use multiple config files for your different environments. `.env` as base then `.env.development` and `.env.production`. For secrets, you can store them in `.env.local`.

> Note: .env, .env.development, and .env.production files should be included in your repository as they define defaults. .env*.local should be added to .gitignore, as those files are intended to be ignored. .env.local is where secrets can be stored.

## Database

`nextjs-checkout` uses `Prisma` ORM meaning you can use a **PostgreSQL**, **MySQL**, **MongoDB**, **SQLite**, **CockroachDB**, or **Microsoft SQL Server** database. 

Connecting to your database is done through the `Prisma` config file `prisma/schema.prisma`. See [here](https://www.prisma.io/docs/concepts/database-connectors) for the config options for your chosen database.

#### Setup / Config

1. Setup DB string into the `DATABASE_CONNECTION_STRING` environment variable in your `.env` file.
2. Start the app with `yarn run dev` to confirm the DB connects without issue.
3. Sync the DB schema with your database: `npx prisma migrate dev --name init`

#### Seed example data

Run the seed command: `npx prisma db seed` to seed example Products into your `products` table.

## Payments

### Stripe

Configuration of Stripe payments is done via the `.env` or `.env.local` file. The relevant values are:

``` sh
NEXT_PUBLIC_PAYMENT_CONFIG=stripe
STRIPE_SECRET_KEY=sk_test
STRIPE_WEBHOOK_SECRET=we_....
```

#### Adding the webhook

Setup the webhook URL within the Stripe dashboard here: [https://dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks). 

Setup the URL endpoint to `https://my-domain-url/api/stripe/webhook`.

### Square

Configuration of Square payments is done via the `.env` or `.env.local` file. The relevant values are:

``` sh
SQUARE_ACCESS_TOKEN=xxxxxx.....
SQUARE_LOCATION_ID=xxxxxxxxxxxxx
SQUARE_WEBHOOK_URL=http://localhost:3000/api/square/webhook
```

#### Adding the webhook

Setup the Webhook URL within the Square developer dashboard here: [https://developer.squareup.com/](https://developer.squareup.com/). 

Setup the URL endpoint to `https://my-domain-url/api/square/webhook`. Ensure you subscribe to `payment.updated` events. 

### Verifone

Configuration of Verifone payments is done via the `.env` or `.env.local` file. The relevant values are:

``` sh
NEXT_PUBLIC_PAYMENT_CONFIG=verifone
VERIFONE_API_ENDPOINT=https://cst.test-gsc.vfims.com
VERIFONE_PUBLIC_KEY=00000000-0000-0000-0000-000000000000
VERIFONE_USER_UID=00000000-0000-0000-0000-000000000000
VERIFONE_ENTITY_ID=00000000-0000-0000-0000-000000000000
VERIFONE_PAYMENT_CONTRACT=00000000-0000-0000-0000-000000000000
VERIFONE_THEME_ID=00000000-0000-0000-0000-000000000000
```

Plese refer to the Verifone documentation on where to obtain these values. 

#### Adding the webhook

Setup a notification in the Verifone dashboard listening on: `Checkout - Transaction succeeded` and `Checkout - Transaction failed`. Setup the URL endpoint to `https://my-domain-url/api/verifone/webhook`.

You can test the webhook by setting up `Ngrok` and forwarding traffic to your app or using Postman to simulate and API call to your endpoint. A payload example:

``` json
{
  "objectType": "StandardEvent",
  "eventId": "9eddccfb-1111-4b08-1111-e1906d784b8d",
  "eventDateTime": "2023-05-05T00:50:58.556Z",
  "recordId": "a4bfa80b-2222-4f53-2222-736fab4be93f",
  "itemId": "a4bfa80b-2222-4f53-2222-736fab4be93f",
  "entityUid": "75c0d895-3333-49e3-3333-4a4c555045f9",
  "source": "CheckoutService",
  "eventType": "CheckoutTransactionSuccess"
}
```

## Products

### Images

Product images are stored on AWS S3. You can simply setup your S3 bucket in AWS Console and add to your `.env` file. 

When managing products in `/admin/products` all images will be automatically uploaded to AWS S3.

``` bash
AWS_S3_BUCKET_NAME=nextjs-checkout
AWS_ACCESS_KEY_ID=my-key
AWS_SECRET_ACCESS_KEY=my-key
```