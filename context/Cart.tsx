import { createContext, useEffect, useState } from 'react';
import * as _ from 'lodash';
import hash from 'object-hash';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(
        typeof window !== 'undefined' && localStorage.getItem('cartItems')
            ? JSON.parse(localStorage.getItem('cartItems'))
            : {
                  meta: {},
                  items: [],
              },
    );

    // Adds an item to the cart
    const addItem = item => {
        const newItem = _.cloneDeep(item);
        const itemHash = generateHash(newItem);
        const isInCart = cart.items.find(
            cartItem => cartItem.cartId === itemHash,
        );

        // If item is aleady in the cart, bump the quantity
        if (isInCart) {
            const updatedItems = cart.items.map(cartItem => {
                if (cartItem.cartId === itemHash) {
                    cartItem.quantity = cartItem.quantity + 1;
                    cartItem.itemTotal =
                        (cartItem.quantity + 1) * parseInt(cartItem.price);
                }
                return cartItem;
            });
            // Set the updated cart
            return setCart({
                meta: cart.meta,
                items: updatedItems,
            });
        }

        // Update the id, quantity and total amount
        newItem.quantity = 1;
        newItem.cartId = itemHash;
        newItem.itemTotal = parseInt(newItem.price);

        // Add the new item to the cart
        const cartItems = [...cart.items];
        cartItems.push(newItem);
        setCart({
            meta: cart.meta,
            items: cartItems,
        });
    };

    const generateHash = item => {
        const itemToHash = {
            id: item.id,
            selectedVariants: item.selectedVariants,
        };
        return hash(itemToHash);
    };

    // Updates the item quantity. Direction can be 'add' or 'reduce', quantity is an integer
    const updateItemQuantity = (item, direction, qty) => {
        // Generate hash
        const newItem = _.cloneDeep(item);
        const itemHash = generateHash(newItem);

        // Check the cart for item and obtain index
        const itemIndex = cart.items.findIndex(
            cartItem => cartItem.cartId === itemHash,
        );

        // If qty is 1 and being reduced, remove item
        if (
            direction === 'reduce' &&
            itemIndex > -1 &&
            cart.items[itemIndex].quantity === 1
        ) {
            const cartItems = _.remove(cart.items, item => {
                return item.cartId !== itemHash;
            });
            // Set the updated cart
            setCart({
                meta: cart.meta,
                items: cartItems,
            });
            return;
        }

        // Add/remove quantity/total to cart
        setCart({
            meta: cart.meta,
            items: cart.items.map(cartItem =>
                cartItem.cartId === itemHash
                    ? {
                          ...cartItem,
                          quantity:
                              direction === 'add'
                                  ? cartItem.quantity + qty
                                  : cartItem.quantity - qty,
                          itemTotal:
                              (direction === 'add'
                                  ? cartItem.quantity + qty
                                  : cartItem.quantity - qty) *
                              parseInt(cartItem.price),
                      }
                    : cartItem,
            ),
        });
    };

    // Sets the metadata for the cart
    const setMetadata = meta => {
        setCart({
            meta: meta,
            items: [...cart.items],
        });
    };

    // Returns the card metadata
    const getMetadata = cart.meta;

    // Removes all items from the cart
    const emptyCart = () => {
        setCart({
            meta: {},
            items: [],
        });
    };

    // Gets the cart total amount
    const getCartTotal = () => {
        return cart.items.reduce(
            (total, item) => total + item.price * item.quantity,
            0,
        );
    };

    // Gets total amount of items adding quantity of each
    const getTotalItems = () => {
        return cart.items.reduce(
            (total, item) => (total = total + item.quantity),
            0,
        );
    };

    // Checks if item is in cart and returns it
    const getItem = item => {
        return cart.items.find(
            cartItem =>
                cartItem.id === item.id &&
                _.isEqual(cartItem.selectedVariants, item.selectedVariants),
        );
    };

    // Gets the total unique items not considering quantity
    const getTotalUniqueItems = () => {
        return cart.items.reduce(total => (total = total + 1), 0);
    };

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        const cartItems = localStorage.getItem('cartItems');
        const parsedCart = JSON.parse(cartItems);
        if (cartItems) {
            setCart({
                meta: parsedCart.meta || {},
                items: parsedCart.items || [],
            });
        }
    }, []);

    return (
        <CartContext.Provider
            value={{
                items: cart.items,
                addItem,
                getItem,
                updateItemQuantity,
                setMetadata,
                metadata: getMetadata,
                emptyCart,
                totalUniqueItems: getTotalUniqueItems,
                totalItems: getTotalItems,
                cartTotal: getCartTotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
