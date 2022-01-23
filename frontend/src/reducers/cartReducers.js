import {
    CART_ADD_ITEM,
    CART_REMOVE_ITEM,
    CART_LOADING_ITEM,
    CART_SAVE_SHIPPING_ADDRESS,
    CART_SAVE_PAYMENT_METHOD,
    CART_CLEAR_ITEMS
} from '../constants/cartConstants';

export const cartReducer = (state = { cartItems: [], loading: false }, { type, payload }) => {
    if (type === CART_LOADING_ITEM)
        return {
            ...state, loading: payload ? false : true
        };

    if (type === CART_ADD_ITEM) {
        const { exist, product } = payload;

        if (exist)
            return {
                ...state,
                loading: false,
                cartItems: state.cartItems.map(item =>
                    item.product === product.product ? product : item)
            };

        return {
            ...state,
            loading: false,
            cartItems: [...state.cartItems, product]
        };
    }

    if (type === CART_REMOVE_ITEM)
        return {
            ...state,
            loading: false,
            cartItems: state.cartItems.filter(item => item.product !== payload)
        };

    if (type === CART_CLEAR_ITEMS)
        return {
            shippingAddress: {},
            loading: false,
            cartItems: [],
            paymentMethod: ''
        };

    if (type === CART_SAVE_SHIPPING_ADDRESS)
        return {
            ...state,
            shippingAddress: payload
        };

    if (type === CART_SAVE_PAYMENT_METHOD)
        return {
            ...state,
            paymentMethod: payload
        };

    return state;
};