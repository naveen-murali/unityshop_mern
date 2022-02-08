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
    PRODUCT_UPDATE_RESET,
    PRODUCT_CREATE_REVIEW_REQUEST,
    PRODUCT_CREATE_REVIEW_SUCCESS,
    PRODUCT_CREATE_REVIEW_FAIL,
    PRODUCT_LIST_ADMIN_REQUESTS,
    PRODUCT_LIST_ADMIN_SUCCESS,
    PRODUCT_LIST_ADMIN_FAIL,
    PRODUCT_TOP_REQUEST,
    PRODUCT_TOP_SUCCESS,
    PRODUCT_TOP_FAIL
} from '../constants/productConstants';


export const productListReducer = (state = { products: [] }, { type, payload }) => {
    if (type === PRODUCT_LIST_REQUESTS)
        return { ...state, loading: true };

    if (type === PRODUCT_LIST_SUCCESS)
        return {
            ...state,
            loading: false,
            products: payload.products,
            page: payload.page,
            pages: payload.pages
        };

    if (type === PRODUCT_LIST_FAIL)
        return { loading: false, error: payload };

    return state;
};

export const productListAdminReducer = (state = { products: [] }, { type, payload }) => {
    if (type === PRODUCT_LIST_ADMIN_REQUESTS)
        return { ...state, loading: true };

    if (type === PRODUCT_LIST_ADMIN_SUCCESS)
        return {
            ...state,
            loading: false,
            products: payload.products,
            page: payload.page,
            pages: payload.pages
        };

    if (type === PRODUCT_LIST_ADMIN_FAIL)
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

export const productDeleteReducer = (state = {}, { type, payload }) => {
    if (type === PRODUCT_DELETE_REQUEST)
        return { loading: true, ...state };

    if (type === PRODUCT_DELETE_SUCCESS)
        return { loading: false, success: true };

    if (type === PRODUCT_DELETE_FAIL)
        return { loading: false, error: payload };

    return state;
};

export const productCreateReducer = (state = {}, { type, payload }) => {
    if (type === PRODUCT_CREATE_REQUEST)
        return { loading: true, ...state };

    if (type === PRODUCT_CREATE_SUCCESS)
        return { loading: false, success: true, product: payload };

    if (type === PRODUCT_CREATE_FAIL)
        return { loading: false, error: payload };

    if (type === PRODUCT_CREATE_RESET)
        return {};

    return state;
};


export const productUpdateReducer = (state = {}, { type, payload }) => {
    if (type === PRODUCT_UPDATE_REQUEST)
        return { loading: true, ...state };

    if (type === PRODUCT_UPDATE_SUCCESS)
        return { loading: false, success: true };

    if (type === PRODUCT_UPDATE_FAIL)
        return { loading: false, error: payload };

    if (type === PRODUCT_UPDATE_RESET)
        return {};

    return state;
};


export const productReviewReducer = (state = {}, { type, payload }) => {
    if (type === PRODUCT_CREATE_REVIEW_REQUEST)
        return { loading: true };

    if (type === PRODUCT_CREATE_REVIEW_SUCCESS)
        return { loading: false };

    if (type === PRODUCT_CREATE_REVIEW_FAIL)
        return { loading: false, error: payload };

    return state;
};


export const productTopRattedReducer = (state = { products: [] }, { type, payload }) => {
    if (type === PRODUCT_TOP_REQUEST)
        return { ...state, loading: true };

    if (type === PRODUCT_TOP_SUCCESS)
        return { loading: false, products: payload };

    if (type === PRODUCT_TOP_FAIL)
        return { loading: false, error: payload };

    return state;
};