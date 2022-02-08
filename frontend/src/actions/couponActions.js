import axios from 'axios';
import {
    COUPON_ADD_FAIL,
    COUPON_ADD_REQUEST,
    COUPON_ADD_SUCCESS,
    COUPON_DELETE_FAIL,
    COUPON_DELETE_REQUEST,
    COUPON_DELETE_SUCCESS,
    COUPON_LIST_FAIL,
    COUPON_LIST_REQUEST,
    COUPON_LIST_SUCCESS
} from '../constants/couponContants';

import { showErrorAlert, showSuccessAlert } from './mainAlertActions';
import { logout } from './userActions';

export const listCoupon = () => async (dispatch, getState) => {
    try {
        dispatch({ type: COUPON_LIST_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.get('/api/coupons', config);

        dispatch({
            type: COUPON_LIST_SUCCESS,
            payload: data
        });
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;

        dispatch({
            type: COUPON_LIST_FAIL,
            payload: message
        });

        if (message === 'Not authorized, token failed' || message === 'Account has been blocked')
            dispatch(logout());
        dispatch(showErrorAlert(message));
    }
};


export const createCoupon = (coupon, discount, expireAt) => async (dispatch, getState) => {
    try {
        dispatch({ type: COUPON_ADD_REQUEST });

        const { userLogin: { userInfo }, couponList: { coupons } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        const postData = {
            coupon,
            discount,
            expireAt
        };
        const { data } = await axios.post('/api/coupons', postData, config);

        dispatch({
            type: COUPON_ADD_SUCCESS,
        });
        dispatch({
            type: COUPON_LIST_SUCCESS,
            payload: [...coupons, data]
        });
        dispatch(showSuccessAlert('Coupon is created'));
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;

        dispatch({
            type: COUPON_ADD_FAIL,
            payload: message
        });

        if (message === 'Not authorized, token failed' || message === 'Account has been blocked')
            dispatch(logout());
        dispatch(showErrorAlert(message));
    }
};


export const deleteCoupon = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: COUPON_DELETE_REQUEST });

        const { userLogin: { userInfo }, couponList: { coupons } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        await axios.delete(`/api/coupons/${id}`, config);

        dispatch({
            type: COUPON_DELETE_SUCCESS,
        });
        dispatch({
            type: COUPON_LIST_SUCCESS,
            payload: coupons.map(coupon => {
                if (coupon._id === id)
                    coupon.isDeleted = true;
                return coupon;
            })
        });
        dispatch(showSuccessAlert('Coupon is deleted'));
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;

        dispatch({
            type: COUPON_DELETE_FAIL,
            payload: message
        });

        if (message === 'Not authorized, token failed' || message === 'Account has been blocked')
            dispatch(logout());
        dispatch(showErrorAlert(message));
    }
};