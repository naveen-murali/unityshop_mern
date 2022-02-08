import {
    BRAND_LIST_FAIL,
    BRAND_LIST_REQUEST,
    BRAND_LIST_SUCCESS,
    BRAND_OFFERS_ADD_FAIL,
    BRAND_OFFERS_ADD_REQUEST,
    BRAND_OFFERS_ADD_SUCCESS,
    BRAND_OFFERS_DELETE_FAIL,
    BRAND_OFFERS_DELETE_REQUEST,
    BRAND_OFFERS_DELETE_SUCCESS
} from '../constants/brandContants';
import { USER_LOGOUT } from '../constants/userConstants';

export const brandListReducer = (state = { brands: [] }, { type, payload }) => {
    if (type === BRAND_LIST_REQUEST)
        return { ...state, loading: true };

    if (type === BRAND_LIST_SUCCESS)
        return { ...state, loading: false, brands: payload };

    if (type === BRAND_LIST_FAIL)
        return { brands: [], loading: false, error: payload };

    if (type === USER_LOGOUT)
        return { brands: [] };
    return state;
};


export const brandOfferCreateReducer = (state = { loading: false }, { type, payload }) => {
    if (type === BRAND_OFFERS_ADD_REQUEST)
        return { loading: true };

    if (type === BRAND_OFFERS_ADD_SUCCESS)
        return { loading: false, success: true };

    if (type === BRAND_OFFERS_ADD_FAIL)
        return { error: payload };

    return state;
};


export const brandOfferDeleteReducer = (state = { loading: false }, { type, payload }) => {
    if (type === BRAND_OFFERS_DELETE_REQUEST)
        return { loading: true };

    if (type === BRAND_OFFERS_DELETE_SUCCESS)
        return { loading: false };

    if (type === BRAND_OFFERS_DELETE_FAIL)
        return { error: payload };

    return state;
};