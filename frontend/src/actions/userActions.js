import axios from 'axios';
import { CART_SAVE_PAYMENT_METHOD, CART_SAVE_SHIPPING_ADDRESS } from '../constants/cartConstants';
import { ORDER_MY_LIST_RESET } from '../constants/orderConstants';
import {
    USER_DELETE_FAIL,
    USER_DELETE_REQUEST,
    USER_DELETE_SUCCESS,
    USER_DETAILS_FAIL,
    USER_DETAILS_REQUEST,
    USER_DETAILS_SUCCESS,
    USER_GOOGLE_AUTH_FAIL,
    USER_GOOGLE_AUTH_REQUEST,
    USER_GOOGLE_AUTH_SUCCESS,
    USER_GOOGLE_LINK_FAIL,
    USER_GOOGLE_LINK_REQUEST,
    USER_GOOGLE_LINK_SUCCESS,
    USER_GOOGLE_REGISTER_FAIL,
    USER_GOOGLE_REGISTER_REQUEST,
    USER_GOOGLE_REGISTER_SUCCESS,
    USER_LIST_FAIL,
    USER_LIST_REQUEST,
    USER_LIST_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGOUT,
    USER_REGISTER_FAIL,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_UPDATE_FAIL,
    USER_UPDATE_PROFILE_FAIL,
    USER_UPDATE_PROFILE_REQUEST,
    USER_UPDATE_PROFILE_SUCCESS,
    USER_UPDATE_REQUEST,
    USER_UPDATE_SUCCESS,
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


export const googleLogin = (googleId) => async (dispatch) => {
    try {
        dispatch({ type: USER_GOOGLE_AUTH_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const { data } = await axios.post('/api/users/google', { googleId }, config);

        dispatch({
            type: USER_GOOGLE_AUTH_SUCCESS
        });
        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data
        });

        localStorage.setItem('userInfo', JSON.stringify(data));
        dispatch(showSuccessAlert(`Hi, ${data.name}`));
    } catch (err) {
        const message = err.response && err.response.data.message
            ? err.response.data.message
            : err.message;
        dispatch({
            type: USER_GOOGLE_AUTH_FAIL,
            payload: message
        });
        dispatch(showErrorAlert(message));
    }
};


export const googleRegister = (name, phone, email, googleId, referralId = '') => async (dispatch) => {
    try {
        dispatch({ type: USER_GOOGLE_REGISTER_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const { data } = await axios.post('/api/users/google/register',
            { name, phone, email, googleId, referralId }, config);

        dispatch({
            type: USER_GOOGLE_REGISTER_SUCCESS
        });
        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data
        });

        localStorage.setItem('userInfo', JSON.stringify(data));
        dispatch(showSuccessAlert(`Hi, ${data.name}`));
    } catch (err) {
        const message = err.response && err.response.data.message
            ? err.response.data.message
            : err.message;
        dispatch({
            type: USER_GOOGLE_REGISTER_FAIL,
            payload: message
        });
        dispatch(showErrorAlert(message));
    }
};


export const linkGoogle = (email, googleId) => async (dispatch, getState) => {
    try {
        dispatch({ type: USER_GOOGLE_LINK_REQUEST });

        const { userInfo } = getState().userLogin;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        };
        const { data } = await axios.post('/api/users/google/link',
            { email, googleId }, config);

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data
        });
        dispatch({
            type: USER_GOOGLE_LINK_SUCCESS
        });

        localStorage.setItem('userInfo', JSON.stringify(data));
        dispatch(showSuccessAlert(`Hi, ${data.name}`));
    } catch (err) {
        const message = err.response && err.response.data.message
            ? err.response.data.message
            : err.message;

        if (message === 'Not authorized, token failed' || message === 'Account has been blocked')
            dispatch(logout());

        dispatch({
            type: USER_GOOGLE_LINK_FAIL,
            payload: message
        });
        dispatch(showErrorAlert(message));
    }
};


export const register = (name, phone, email, password, referralId = '') => async (dispatch) => {
    try {
        dispatch({ type: USER_REGISTER_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const { data } = await axios.post('/api/users',
            { name, phone, email, password, referralId }, config);

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

        if (message === 'Not authorized, token failed' || message === 'Account has been blocked') {
            dispatch(logout());
            dispatch(showErrorAlert('Token Failed'));
        }

        dispatch({
            type: USER_DETAILS_FAIL,
            payload: message
        });
        dispatch(showErrorAlert(message));
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

        if (message === 'Not authorized, token failed' || message === 'Account has been blocked')
            dispatch(logout());
        dispatch(showErrorAlert(message));

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

        if (message === 'Not authorized, token failed' || message === 'Account has been blocked')
            dispatch(logout());
        dispatch(showErrorAlert(message));
    }
};


export const listUsers = (keyword = '', pageNumber = '') => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_LIST_REQUEST,
        });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.get(`/api/users?keyword=${keyword}&pageNumber=${pageNumber}`, config);

        dispatch({
            type: USER_LIST_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;

        if (message === 'Not authorized, token failed' || message === 'Account has been blocked')
            dispatch(logout());
        dispatch(showErrorAlert(message));

        dispatch({
            type: USER_LIST_FAIL,
            payload: message,
        });
    }
};

export const deleteUser = (id, email) => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_DELETE_REQUEST,
        });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        await axios.delete(`/api/users/${id}`, config);
        dispatch(showSuccessAlert(`${email} has been deleted`));
        dispatch({ type: USER_DELETE_SUCCESS });
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;

        if (message === 'Not authorized, token failed' || message === 'Account has been blocked')
            dispatch(logout());
        dispatch(showErrorAlert(message));

        dispatch({
            type: USER_DELETE_FAIL,
            payload: message,
        });
    }
};

export const updateUser = (user) => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_UPDATE_REQUEST,
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

        const { data } = await axios.put(`/api/users/${user.id}`, user, config);
        dispatch({ type: USER_UPDATE_SUCCESS });
        dispatch({
            type: USER_DETAILS_SUCCESS,
            payload: data
        });

        dispatch(showSuccessAlert(`User has been updated`));
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;

        if (message === 'Not authorized, token failed' || message === 'Account has been blocked')
            dispatch(logout());
        dispatch(showErrorAlert(message));

        dispatch({
            type: USER_UPDATE_FAIL,
            payload: message,
        });
    }
};

export const addressSave = (address) => async (dispatch, getState) => {
    try {
        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.post(`/api/users/address`, address, config);
        dispatch({
            type: USER_UPDATE_PROFILE_SUCCESS,
            payload: data,
        });

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data,
        });

        localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;

        if (message === 'Not authorized, token failed' || message === 'Account has been blocked')
            dispatch(logout());
        dispatch(showErrorAlert(message));
    }
};
export const addressUpdate = (id, address, deleteStatus = '') => async (dispatch, getState) => {
    try {
        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.put(`/api/users/address?id=${id}&delete=${deleteStatus}`, address, config);
        dispatch({
            type: USER_UPDATE_PROFILE_SUCCESS,
            payload: data,
        });

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data,
        });

        localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;

        if (message === 'Not authorized, token failed' || message === 'Account has been blocked')
            dispatch(logout());
        dispatch(showErrorAlert(message));
    }
};
