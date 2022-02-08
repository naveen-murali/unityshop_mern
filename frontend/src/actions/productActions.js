import axios from 'axios';
import {
    PRODUCT_LIST_REQUESTS,
    PRODUCT_LIST_SUCCESS,
    PRODUCT_LIST_FAIL,
    PRODUCT_DETAILS_REQUESTS,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL,
    REMOVE_PRODUCT_DETAILS,
    PRODUCT_DELETE_REQUEST,
    PRODUCT_DELETE_SUCCESS,
    PRODUCT_DELETE_FAIL,
    PRODUCT_CREATE_REQUEST,
    PRODUCT_CREATE_SUCCESS,
    PRODUCT_CREATE_FAIL,
    PRODUCT_CREATE_RESET,
    PRODUCT_UPDATE_REQUEST,
    PRODUCT_UPDATE_SUCCESS,
    PRODUCT_UPDATE_FAIL,
    PRODUCT_CREATE_REVIEW_REQUEST,
    PRODUCT_CREATE_REVIEW_SUCCESS,
    PRODUCT_CREATE_REVIEW_FAIL,
    PRODUCT_LIST_ADMIN_REQUESTS,
    PRODUCT_LIST_ADMIN_SUCCESS,
    PRODUCT_LIST_ADMIN_FAIL,
    PRODUCT_TOP_SUCCESS,
    PRODUCT_TOP_REQUEST,
    PRODUCT_TOP_FAIL
} from '../constants/productConstants';
import { showErrorAlert, showSuccessAlert } from './mainAlertActions';
import { logout } from './userActions';


export const listProducts = (keyword = '', pageNumber = '') => async (dispatch, getState) => {
    try {
        const { products } = getState().productList;
        if (products && !products.length)
            dispatch({ type: PRODUCT_LIST_REQUESTS });

        const { data } = await axios.get(`/api/products?keyword=${keyword}&pageNumber=${pageNumber}`);

        dispatch({
            type: PRODUCT_LIST_SUCCESS,
            payload: data
        });
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;

        dispatch({
            type: PRODUCT_LIST_FAIL,
            payload: message
        });

        if (message === 'Not authorized, token failed' || message === 'Account has been blocked')
            dispatch(logout());

        dispatch(showErrorAlert(message));
    }
};

export const listProductsAdmin = (keyword = '', pageNumber = '') => async (dispatch, getState) => {
    try {
        const { products } = getState().productListAdmin;

        if (!products.length)
            dispatch({ type: PRODUCT_LIST_ADMIN_REQUESTS });

        const { userLogin: { userInfo } } = getState();
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.get(`/api/products/admin?keyword=${keyword}&pageNumber=${pageNumber}`, config);

        dispatch({
            type: PRODUCT_LIST_ADMIN_SUCCESS,
            payload: data
        });
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;

        dispatch({
            type: PRODUCT_LIST_ADMIN_FAIL,
            payload: message
        });

        if (message === 'Not authorized, token failed' || message === 'Account has been blocked')
            dispatch(logout());

        dispatch(showErrorAlert(message));
    }
};

export const getOneProducts = (id) => async (dispatch) => {
    try {
        dispatch({
            type: PRODUCT_DETAILS_REQUESTS
        });

        const { data } = await axios.get(`/api/products/${id}`);

        dispatch({
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data
        });
    } catch (err) {
        const message = err.response && err.response.data.message
            ? err.response.data.message
            : err.message;
        dispatch({
            type: PRODUCT_DETAILS_FAIL,
            payload: message
        });

        if (message === 'Not authorized, token failed' || message === 'Account has been blocked')
            dispatch(logout());

        dispatch(showErrorAlert(message));
    }
};

export const removeProduct = () => {
    return {
        type: REMOVE_PRODUCT_DETAILS
    };
};


export const deleteProduct = (id, product) => async (dispatch, getState) => {
    try {
        dispatch({
            type: PRODUCT_DELETE_REQUEST,
        });

        const { userLogin: { userInfo }, productListAdmin: { products } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        await axios.delete(`/api/products/admin/${id}`, config);

        dispatch({
            type: PRODUCT_DELETE_SUCCESS
        });
        if (products.length)
            dispatch({
                type: PRODUCT_LIST_SUCCESS,
                payload: products.map(product => {
                    if (product._id === id && product.isDeleted === false) {
                        console.log(product);
                        product.isDeleted = true;
                    }

                    return product;
                })
            });

        dispatch(showSuccessAlert(`${product} has been deleted`));
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;

        dispatch({
            type: PRODUCT_DELETE_FAIL,
            payload: message,
        });

        if (message === 'Not authorized, token failed' || message === 'Account has been blocked')
            dispatch(logout());

        dispatch(showErrorAlert(message));
    }
};


export const createProduct = (product) => async (dispatch, getState) => {
    try {
        dispatch({
            type: PRODUCT_CREATE_REQUEST,
        });

        const { userLogin: { userInfo } } = getState();
        const formData = new FormData();

        const keys = Object.keys(product);
        const values = Object.values(product);

        keys.forEach((key, index) => {
            if (key === 'image')
                return values[index].forEach(image =>
                    formData.append(`image`, image, image.name));

            formData.append(key, values[index]);
        });

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.post(`/api/products`, formData, config);

        dispatch({
            type: PRODUCT_CREATE_SUCCESS,
            payload: data
        });
        dispatch({
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data
        });
        dispatch(showSuccessAlert(`${product.name} has been created`));
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;

        dispatch({
            type: PRODUCT_CREATE_FAIL,
            payload: message,
        });

        if (message === 'Not authorized, token failed' || message === 'Account has been blocked')
            dispatch(logout());

        dispatch(showErrorAlert(message));
    }
};
export const createProductReset = () => {
    return {
        type: PRODUCT_CREATE_RESET
    };
};


export const updateProduct = (updateProduct) => async (dispatch, getState) => {
    try {
        dispatch({
            type: PRODUCT_UPDATE_REQUEST,
        });

        const { userLogin: { userInfo }, productListAdmin: { products } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.put(`/api/products/${updateProduct.id}`, updateProduct, config);

        dispatch({
            type: PRODUCT_UPDATE_SUCCESS,
        });
        dispatch({
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data
        });
        if (products.length)
            dispatch({
                type: PRODUCT_LIST_SUCCESS,
                payload: products.map(product => {
                    if (product._id === updateProduct.id)
                        return { ...product, ...data };
                    return product;
                })
            });
        dispatch(showSuccessAlert(`${updateProduct.name} has been updated`));
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;

        dispatch({
            type: PRODUCT_UPDATE_FAIL,
            payload: message,
        });

        if (message === 'Not authorized, token failed' || message === 'Account has been blocked') {
            dispatch(logout());
            dispatch(showErrorAlert(message));
        }
    }
};
export const updateProductReset = () => {
    return {
        type: PRODUCT_CREATE_RESET
    };
};


export const reviewProduct = (id, review) => async (dispatch, getState) => {
    try {
        dispatch({
            type: PRODUCT_CREATE_REVIEW_REQUEST,
        });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.put(`/api/products/${id}/reviews`, review, config);

        dispatch({
            type: PRODUCT_CREATE_REVIEW_SUCCESS,
        });
        dispatch({
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data
        });
        dispatch(showSuccessAlert(`Your review is added`));
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;

        dispatch({
            type: PRODUCT_CREATE_REVIEW_FAIL,
            payload: message,
        });

        if (message === 'Not authorized, token failed' || message === 'Account has been blocked') {
            dispatch(logout());
            dispatch(showErrorAlert(message));
        }
    }
};


export const listTopProduct = () => async (dispatch) => {
    try {
        dispatch({
            type: PRODUCT_TOP_REQUEST,
        });

        const { data } = await axios.get(`/api/products/top`);

        dispatch({
            type: PRODUCT_TOP_SUCCESS,
            payload: data
        });
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;

        dispatch({
            type: PRODUCT_TOP_FAIL,
            payload: message,
        });

        if (message === 'Not authorized, token failed' || message === 'Account has been blocked') {
            dispatch(logout());
            dispatch(showErrorAlert(message));
        }
    }
};