import axios from 'axios';
import {
    BRAND_EDIT_FAIL,
    BRAND_EDIT_REQUEST,
    BRAND_EDIT_SUCCESS,
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

import { showErrorAlert, showSuccessAlert } from './mainAlertActions';
import { logout } from './userActions';


export const getBrandList = () => async (dispatch, getState) => {
    try {
        dispatch({ type: BRAND_LIST_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.get('/api/products/brands', config);

        dispatch({
            type: BRAND_LIST_SUCCESS,
            payload: data
        });
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;

        dispatch({
            type: BRAND_LIST_FAIL,
            payload: message
        });

        if (message === 'Not authorized, token failed' || message === 'Account has been blocked')
            dispatch(logout());
        dispatch(showErrorAlert(message));
    }
};


export const createBrand = (name) => async (dispatch, getState) => {
    try {
        dispatch({ type: BRAND_EDIT_REQUEST });

        const { userLogin: { userInfo }, brandList: { brands } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.post('/api/products/brands', { name }, config);

        dispatch({
            type: BRAND_EDIT_SUCCESS,
        });
        dispatch({
            type: BRAND_LIST_SUCCESS,
            payload: [...brands, data]
        });
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;

        dispatch({
            type: BRAND_EDIT_FAIL,
            payload: message
        });

        if (message === 'Not authorized, token failed' || message === 'Account has been blocked')
            dispatch(logout());
        dispatch(showErrorAlert(message));
    }
};


export const editBrand = (id, name, discount, isDeleted = false) => async (dispatch, getState) => {
    try {
        dispatch({ type: BRAND_EDIT_REQUEST });

        const { userLogin: { userInfo }, brandList: { brands } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.put(`/api/products/brands/${id}`, { name, discount, isDeleted }, config);

        dispatch({
            type: BRAND_EDIT_SUCCESS,
        });
        dispatch({
            type: BRAND_LIST_SUCCESS,
            payload: brands.map(brand => brand._id === data._id ? data : brand)
        });
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;

        dispatch({
            type: BRAND_EDIT_FAIL,
            payload: message
        });

        if (message === 'Not authorized, token failed' || message === 'Account has been blocked')
            dispatch(logout());
        dispatch(showErrorAlert(message));
    }
};


export const addBrandOffer = (id, discount, expireAt) => async (dispatch, getState) => {
    try {
        dispatch({ type: BRAND_OFFERS_ADD_REQUEST });

        const { userLogin: { userInfo }, brandList: { brands } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.post(`/api/products/brands/offers/${id}`, { discount, expireAt }, config);

        dispatch({
            type: BRAND_OFFERS_ADD_SUCCESS,
        });
        dispatch({
            type: BRAND_LIST_SUCCESS,
            payload: brands.map(brand => brand._id === data._id ? data : brand)
        });
        dispatch(showSuccessAlert('Offer has been added.'));
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;

        dispatch({
            type: BRAND_OFFERS_ADD_FAIL,
            payload: message
        });

        if (message === 'Not authorized, token failed' || message === 'Account has been blocked')
            dispatch(logout());
        dispatch(showErrorAlert(message));
    }
};


export const deleteBrandOffer = (offerId, brandId) => async (dispatch, getState) => {
    try {
        dispatch({ type: BRAND_OFFERS_DELETE_REQUEST });

        const { userLogin: { userInfo }, brandList: { brands } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        await axios.delete(`/api/products/brands/offers/${brandId}/${offerId}`, config);

        dispatch({
            type: BRAND_OFFERS_DELETE_SUCCESS,
        });
        dispatch({
            type: BRAND_LIST_SUCCESS,
            payload: brands.map(brand => {
                if (brand._id === brandId)
                    brand.offers = brand.offers.map(offer => {
                        if (offer._id === offerId)
                            offer.isDeleted = true;

                        return offer;
                    });
                return brand;
            })
        });
        dispatch(showSuccessAlert('Offer is added.'));
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;

        dispatch({
            type: BRAND_OFFERS_DELETE_FAIL,
            payload: message
        });

        if (message === 'Not authorized, token failed' || message === 'Account has been blocked')
            dispatch(logout());
        dispatch(showErrorAlert(message));
    }
};