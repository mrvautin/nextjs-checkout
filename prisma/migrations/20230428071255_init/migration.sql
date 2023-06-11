CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable
CREATE TABLE "orders" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "result" TEXT,
    "cart" JSON,
    "transaction_id" TEXT,
    "checkout_id" TEXT,
    "paid" BOOLEAN,
    "gateway" TEXT,

    CONSTRAINT "orders_pkey1" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT,
    "permalink" TEXT,
    "summary" TEXT,
    "description" TEXT,
    "price" DECIMAL,
    "images" JSON,
    "currency" TEXT,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);
