import {
    PRODUCT_LIST_REQUESTS,
    PRODUCT_LIST_SUCCESS,
    PRODUCT_LIST_FAIL,
    PRODUCT_DETAILS_REQUESTS,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL,
    REMOVE_PRODUCT_DETAILS
} from '../constants/productConstants';


export const productListReducer = (state = { products: [] }, { type, payload }) => {
    if (type === PRODUCT_LIST_REQUESTS)
        return { ...state, loading: true };

    if (type === PRODUCT_LIST_SUCCESS)
        return { ...state, loading: false, products: payload };

    if (type === PRODUCT_LIST_FAIL)
        return { loading: false, error: payload };

    return state;
};

export const productDetailsReducer = (state = { product: { reviews: [] } }, { type, payload }) => {
    if (type === PRODUCT_DETAILS_REQUESTS)
        return { loading: true, ...state };

    if (type === PRODUCT_DETAILS_SUCCESS)
        return { loading: false, product: payload };

    if (type === PRODUCT_DETAILS_FAIL)
        return { loading: false, error: payload };

    if (type === REMOVE_PRODUCT_DETAILS)
        return { product: { reviews: [] } };

    return state;
};