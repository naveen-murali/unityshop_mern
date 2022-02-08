import {
    CART_ADD_ITEM,
    CART_LOADING_ITEM,
    CART_REMOVE_ITEM,
    CART_SAVE_PAYMENT_METHOD,
    CART_SAVE_SHIPPING_ADDRESS
} from '../constants/cartConstants';
import axios from 'axios';
import { showErrorAlert, showSuccessAlert } from './mainAlertActions';
import { logout } from './userActions';

export const addToCart = (id, qty, Alert = true) => async (dispatch, getState) => {
    try {
        const { cartItems } = getState().cart;
        const existItem = cartItems.find(item => item.product === id);
        let payload = {};

        if (!existItem) {
            dispatch({ type: CART_LOADING_ITEM });

            const { data } = await axios.get(`/api/products/${id}`);
            const brandOffer = data.brand.offers.find(offer =>
                !offer.isDeleted && new Date(offer.expireAt) > new Date(now()));
            const discount = brandOffer ? brandOffer.discount : data.discount;

            payload = {
                exist: false,
                product: {
                    product: data._id,
                    name: data.name,
                    image: data.image[0],
                    price: data.price,
                    countInStock: data.countInStock,
                    discount: discount || 0,
                    qty: parseInt(qty)
                }
            };
        } else {
            existItem.qty = parseInt(qty);
            payload = { exist: true, product: existItem };
        }

        dispatch({
            type: CART_ADD_ITEM,
            payload
        });

        localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));

        if (Alert)
            dispatch(showSuccessAlert(`${payload.product.name} is added to cart`));
    } catch (err) {
        dispatch({ type: CART_LOADING_ITEM, payload: true });
        dispatch(showErrorAlert(
            err.response && err.response.data.message
                ? err.response.data.message
                : err.message));
    }
};

export const removeFromCart = (id) => (dispatch, getState) => {
    const productName = getState().cart.cartItems.find(item => item.product === id).name;

    dispatch({
        type: CART_REMOVE_ITEM,
        payload: id
    });

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
    dispatch(showSuccessAlert(`${productName} is removed from the cart`));
};

export const saveShippingAddress = (data) => (dispatch) => {
    dispatch({
        type: CART_SAVE_SHIPPING_ADDRESS,
        payload: data
    });

    localStorage.setItem('shippingAddress', JSON.stringify(data));
};

export const savePaymentMethod = (paymentMethod) => (dispatch) => {
    dispatch({
        type: CART_SAVE_PAYMENT_METHOD,
        payload: paymentMethod
    });

    localStorage.setItem('paymentMethod', paymentMethod);
};

export const refreshCart = () => async (dispatch, getState) => {
    const { cartItems } = getState().cart;

    try {
        const ids = cartItems.map(item => item.product);

        ids.forEach(async (id, index) => {
            const { data } = await axios.get(`/api/products/${id}`);

            if (data.countInStock < parseInt(cartItems[index].qty)) {
                console.log('hi');
                return dispatch(removeFromCart(id));
            }

            const brandOffer = data.brand.offers.find(offer =>
                !offer.isDeleted && new Date(offer.expireAt) > new Date(now()));
            const discount = brandOffer ? brandOffer.discount : data.discount;

            const payload = {
                exist: true,
                product: {
                    product: data._id,
                    name: data.name,
                    image: data.image[0],
                    price: data.price,
                    countInStock: data.countInStock,
                    discount: discount || 0,
                    qty: parseInt(cartItems[index].qty)
                }
            };
            dispatch({
                type: CART_ADD_ITEM,
                payload
            });
        });
    } catch (err) {
        const message = err.response && err.response.data.message
            ? err.response.data.message
            : err.message;
        dispatch({ type: CART_LOADING_ITEM, payload: true });

        if (message === 'Not authorized, token failed' || message === 'Account has been blocked')
            dispatch(logout());
        dispatch(showErrorAlert(message));
    }
};

const now = () => {
    const d = new Date();
    const yy = d.getFullYear();
    const mm = (d.getMonth() + 1 < 10) ? `0${d.getMonth() + 1}` : (d.getMonth() + 1);
    const dd = ((d.getDate()) < 10) ? `0${(d.getDate())}` : ((d.getDate()));
    const newDate = `${yy}-${mm}-${dd}`;
    return newDate;
};
