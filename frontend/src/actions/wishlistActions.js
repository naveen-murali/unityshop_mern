import {
    WISHLIST_REQUESTS,
    WISHLIST_SUCCESS,
    WISHLIST_FAIL,
    WISHLIST_RESET
} from '../constants/wishslistConstants.js';
import { USER_CHANGE_WISHLIST_COUNT } from '../constants/userConstants.js';

import axios from 'axios';
import { showErrorAlert, showSuccessAlert } from './mainAlertActions.js';
import { logout } from './userActions.js';


export const addToWishlist = (id, product) => async (dispatch, getState) => {
    try {
        const { userInfo } = getState().userLogin;
        const { wishlistCount } = userInfo;
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        await axios.put(`/api/users/wishlists`, { id }, config);
        dispatch({
            type: USER_CHANGE_WISHLIST_COUNT,
            payload: wishlistCount + 1
        });
        dispatch(showSuccessAlert(`${product} is added to the wishlist`));
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
    } catch (err) {
        const message = err.response && err.response.data.message
            ? err.response.data.message
            : err.message;

        dispatch(showErrorAlert(message));
    }
};

export const removeFromWishlist = (id, product) => async (dispatch, getState) => {
    try {
        const { userInfo } = getState().userLogin;
        const { wishlistCount } = userInfo;
        const { wishlistItems } = getState().wishlist;
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        dispatch({
            type: WISHLIST_SUCCESS,
            payload: wishlistItems.filter(item => item._id !== id)
        });

        dispatch(showSuccessAlert(`${product} is deleted from the wishlist`));
        dispatch({
            type: USER_CHANGE_WISHLIST_COUNT,
            payload: wishlistCount - 1
        });
        await axios.delete(`/api/users/wishlists?id=${id}`, config);
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
    } catch (err) {
        console.error(err);
        const message = err.response && err.response.data.message
            ? err.response.data.message
            : err.message;

        if (message === 'Not authorized, token failed') {
            dispatch(logout());
            dispatch(showErrorAlert('Token Failed'));
        }

        dispatch(showErrorAlert(message));
    }
};

export const getWishlist = () => async (dispatch, getState) => {
    try {
        dispatch({ type: WISHLIST_REQUESTS });

        const { userInfo } = getState().userLogin;
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        const { data } = await axios.get('/api/users/wishlists', config);

        dispatch({
            type: WISHLIST_SUCCESS,
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
            type: WISHLIST_FAIL,
            payload: message
        });
    }
};

export const resetWishlist = () => (dispatch) => {
    dispatch({ type: WISHLIST_RESET });
};