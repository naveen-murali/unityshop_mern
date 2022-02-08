import {
    COUPON_ADD_REQUEST,
    COUPON_ADD_SUCCESS,
    COUPON_ADD_FAIL,
    COUPON_DELETE_REQUEST,
    COUPON_DELETE_SUCCESS,
    COUPON_DELETE_FAIL,
    COUPON_LIST_REQUEST,
    COUPON_LIST_SUCCESS,
    COUPON_LIST_FAIL,
} from '../constants/couponContants';
import { USER_LOGOUT } from '../constants/userConstants';

export const couponListReducer = (state = { coupons: [] }, { type, payload }) => {
    if (type === COUPON_LIST_REQUEST)
        return { ...state, loading: true };

    if (type === COUPON_LIST_SUCCESS)
        return { ...state, loading: false, coupons: payload };

    if (type === COUPON_LIST_FAIL)
        return { coupons: [], loading: false, error: payload };

    if (type === USER_LOGOUT)
        return { coupons: [] };

    return state;
};

export const couponCreateReducer = (state = { loading: false }, { type, payload }) => {
    if (type === COUPON_ADD_REQUEST)
        return { loading: true };

    if (type === COUPON_ADD_SUCCESS)
        return { loading: false, success: true };

    if (type === COUPON_ADD_FAIL)
        return { error: payload };

    if (type === USER_LOGOUT)
        return { loading: false };

    return state;
};

export const couponDeleteReducer = (state = { loading: false }, { type, payload }) => {
    if (type === COUPON_DELETE_REQUEST)
        return { loading: true };

    if (type === COUPON_DELETE_SUCCESS)
        return { loading: false, success: true };

    if (type === COUPON_DELETE_FAIL)
        return { error: payload };

    if (type === USER_LOGOUT)
        return { loading: false };

    return state;
};
