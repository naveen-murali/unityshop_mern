import axios from 'axios';
import {
    ORDER_CREATE_REQUEST,
    ORDER_CREATE_SUCCESS,
    ORDER_CREATE_FAIL,
    ORDER_DETAILS_SUCCESS,
    ORDER_DETAILS_FAIL,
    ORDER_DETAILS_REQUEST,
    ORDER_PAY_RESET,
    ORDER_MY_LIST_REQUEST,
    ORDER_MY_LIST_SUCCESS,
    ORDER_MY_LIST_FAIL,
    ORDER_DETAILS_CANCEL_FAIL,
    ORDER_DETAILS_CANCEL_SUCCESS,
    ORDER_DETAILS_CANCEL_REQUEST,
    ORDER_CREATE_RESET,
    ORDER_LIST_REQUEST,
    ORDER_LIST_SUCCESS,
    ORDER_LIST_FAIL,
    ORDER_DELIVER_REQUEST,
    ORDER_DELIVER_SUCCESS,
    ORDER_DELIVER_FAIL,
} from '../constants/orderConstants';
import { CART_CLEAR_ITEMS } from '../constants/cartConstants';
import { logout, varifyuser } from './userActions';
import { showErrorAlert, showSuccessAlert } from './mainAlertActions';


export const createOrder = (order) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_CREATE_REQUEST,
        });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.post(`/api/orders`, order, config);

        dispatch({
            type: ORDER_CREATE_SUCCESS,
            payload: data,
        });
        dispatch(showSuccessAlert('Your order has been placed. Thank you for shopping with us.'));
        dispatch({
            type: CART_CLEAR_ITEMS,
            payload: data,
        });
        localStorage.removeItem('cartItems');
        localStorage.removeItem('shippingAddress');
        localStorage.removeItem('paymentMethod');

        dispatch(varifyuser());
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;

        if (message === 'Not authorized, token failed' || message === 'Account has been blocked') {
            dispatch(logout());
            dispatch(showErrorAlert(message));
        }

        dispatch({
            type: ORDER_CREATE_FAIL,
            payload: message,
        });
    }
};
export const resetCreateOrder = () => {
    return {
        type: ORDER_CREATE_RESET
    };
};

export const getOrder = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_DETAILS_REQUEST,
        });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.get(`/api/orders/${id}`, config);

        dispatch({
            type: ORDER_DETAILS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;

        if (message === 'Not authorized, token failed' || message === 'Account has been blocked') {
            dispatch(logout());
            dispatch(showErrorAlert(message));
        }

        dispatch({
            type: ORDER_DETAILS_FAIL,
            payload: message,
        });
    }
};

export const resetOrder = () => (dispatch) => {
    dispatch({
        type: ORDER_PAY_RESET
    });
};

export const listMyOrders = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_MY_LIST_REQUEST,
        });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.get(`/api/orders/myOrders`, config);

        dispatch({
            type: ORDER_MY_LIST_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;

        if (message === 'Not authorized, token failed' || message === 'Account has been blocked') {
            dispatch(logout());
            dispatch(showErrorAlert(message));
        }

        dispatch({
            type: ORDER_MY_LIST_FAIL,
            payload: message,
        });
    }
};

export const cancelMyOrder = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_DETAILS_CANCEL_REQUEST,
        });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.delete(`/api/orders/myOrders/${id}`, config);

        dispatch({
            type: ORDER_DETAILS_CANCEL_SUCCESS,
        });
        dispatch({
            type: ORDER_DETAILS_SUCCESS,
            payload: data,
        });

    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;

        if (message === 'Not authorized, token failed' || message === 'Account has been blocked') {
            dispatch(logout());
            dispatch(showErrorAlert(message));
        }

        dispatch({
            type: ORDER_DETAILS_CANCEL_FAIL,
            payload: message,
        });
    }
};

export const deliverOrder = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_DELIVER_REQUEST,
        });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.put(`/api/orders/${id}/deliver`, {}, config);

        dispatch({
            type: ORDER_DELIVER_SUCCESS
        });
        dispatch({
            type: ORDER_DETAILS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;

        if (message === 'Not authorized, token failed' || message === 'Account has been blocked') {
            dispatch(logout());
            dispatch(showErrorAlert(message));
        }

        dispatch({
            type: ORDER_DELIVER_FAIL,
            payload: message,
        });
    }
};


export const listOrders = (pageNumber) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_LIST_REQUEST,
        });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.get(`/api/orders?pageNumber=${pageNumber}`, config);

        dispatch({
            type: ORDER_LIST_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;

        if (message === 'Not authorized, token failed' || message === 'Account has been blocked') {
            dispatch(logout());
            dispatch(showErrorAlert(message));
        }

        dispatch({
            type: ORDER_LIST_FAIL,
            payload: message,
        });
    }
};