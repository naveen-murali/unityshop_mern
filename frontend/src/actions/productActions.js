import axios from 'axios';
import {
    PRODUCT_LIST_REQUESTS,
    PRODUCT_LIST_SUCCESS,
    PRODUCT_LIST_FAIL,
    PRODUCT_DETAILS_REQUESTS,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL,
    REMOVE_PRODUCT_DETAILS
} from '../constants/productConstants';


export const listProducts = () => async (dispatch, state) => {
    try {
        const { products } = state().productList;

        if (!products.length)
            dispatch({ type: PRODUCT_LIST_REQUESTS });

        const { data } = await axios.get('/api/products');

        dispatch({
            type: PRODUCT_LIST_SUCCESS,
            payload: data
        });
    } catch (err) {
        dispatch({
            type: PRODUCT_LIST_FAIL,
            payload: err.response && err.response.data.message
                ? err.response.data.message
                : err.message
        });
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
        dispatch({
            type: PRODUCT_DETAILS_FAIL,
            payload: err.response && err.response.data.message
                ? err.response.data.message
                : err.message
        });
    }
};

export const removeProduct = () => {
    return {
        type: REMOVE_PRODUCT_DETAILS
    };
};