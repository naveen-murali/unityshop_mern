import axios from 'axios';
import { CART_SAVE_PAYMENT_METHOD, CART_SAVE_SHIPPING_ADDRESS } from '../constants/cartConstants';
import { ORDER_MY_LIST_RESET } from '../constants/orderConstants';
import {
    USER_DETAILS_FAIL,
    USER_DETAILS_REQUEST,
    USER_DETAILS_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGOUT,
    USER_REGISTER_FAIL,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_UPDATE_PROFILE_FAIL,
    USER_UPDATE_PROFILE_REQUEST,
    USER_UPDATE_PROFILE_SUCCESS,
    USER_VARIFIED
} from '../constants/userConstants';
import { WISHLIST_RESET } from '../constants/wishslistConstants';

import { showErrorAlert, showSuccessAlert } from './mainAlertActions';

export const logout = () => (dispatch) => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');

    dispatch({ type: USER_LOGOUT });
    dispatch({
        type: CART_SAVE_SHIPPING_ADDRESS,
        payload: {}
    });
    dispatch({
        type: CART_SAVE_PAYMENT_METHOD,
        payload: {}
    });
    dispatch({ type: WISHLIST_RESET });
    dispatch({ type: ORDER_MY_LIST_RESET });

    dispatch(showSuccessAlert('Successfuly logged out.'));
};

export const login = (email, password) => async (dispatch) => {
    try {
        dispatch({ type: USER_LOGIN_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const { data } = await axios.post('/api/users/login',
            { email, password }, config);

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data
        });

        localStorage.setItem('userInfo', JSON.stringify(data));
        dispatch(showSuccessAlert(`Hi, ${data.name}`));
    } catch (err) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: err.response && err.response.data.message
                ? err.response.data.message
                : err.message
        });
    }
};


export const register = (name, phone, email, password) => async (dispatch) => {
    try {
        dispatch({ type: USER_REGISTER_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const { data } = await axios.post('/api/users',
            { name, phone, email, password }, config);

        dispatch({
            type: USER_REGISTER_SUCCESS,
            payload: data
        });
        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data
        });

        localStorage.setItem('userInfo', JSON.stringify(data));
        dispatch(showSuccessAlert(`Hi, ${data.name}`));
    } catch (err) {
        dispatch({
            type: USER_REGISTER_FAIL,
            payload: err.response && err.response.data.message
                ? err.response.data.message
                : err.message
        });
    }
};


export const getUserDetails = (id) => async (dispatch, getState) => {
    try {
        const { userInfo } = getState().userLogin;

        dispatch({ type: USER_DETAILS_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        };
        const { data } = await axios.get(`/api/users/${id}`, config);

        dispatch({
            type: USER_DETAILS_SUCCESS,
            payload: data
        });
    } catch (err) {
        const message = err.response && err.response.data.message
            ? err.response.data.message
            : err.message;
        if (message === 'Not authorized, token failed') {
            dispatch(logout());
            dispatch(showErrorAlert('Token Failed'));
        }
        dispatch({
            type: USER_DETAILS_FAIL,
            payload: message
        });
    }
};

export const updateUserProfile = (user) => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_UPDATE_PROFILE_REQUEST,
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
        const { data } = await axios.put(`/api/users/profile`, user, config);

        dispatch({
            type: USER_UPDATE_PROFILE_SUCCESS,
            payload: data,
        });

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data,
        });

        dispatch(showSuccessAlert('Profile Updated'));
        localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;

        if (message === 'Not authorized, token failed') {
            dispatch(logout());
            dispatch(showErrorAlert('Token Failed'));
        }

        dispatch({
            type: USER_UPDATE_PROFILE_FAIL,
            payload: message,
        });
    }
};

export const varifyuser = () => async (dispatch, getState) => {
    try {
        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.get('/api/users/varifyUser', config);

        dispatch({
            type: USER_VARIFIED,
            payload: data
        });

        localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (err) {
        const message = err.response && err.response.data.message
            ? err.response.data.message
            : err.message;

        if (message === 'Not authorized, token failed') {
            dispatch(logout);
            dispatch(showErrorAlert('Token Failed'));
        }
        if (err.response.status === 404 && message === 'User Not found') {
            dispatch(logout());
            dispatch(showErrorAlert('Failed varify the existance of the user'));
        }
    }
};
