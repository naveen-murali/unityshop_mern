import {
    ORDER_CREATE_SUCCESS,
    ORDER_CREATE_REQUEST,
    ORDER_CREATE_FAIL,
    ORDER_DETAILS_REQUEST,
    ORDER_DETAILS_SUCCESS,
    ORDER_DETAILS_FAIL,
    ORDER_DETAILS_RESET,
    ORDER_MY_LIST_REQUEST,
    ORDER_MY_LIST_SUCCESS,
    ORDER_MY_LIST_FAIL,
    ORDER_MY_LIST_RESET,
    ORDER_DETAILS_CANCEL_REQUEST,
    ORDER_DETAILS_CANCEL_SUCCESS,
    ORDER_DETAILS_CANCEL_FAIL
} from '../constants/orderConstants';


export const orderCreatesReducers = (state = {}, { type, payload }) => {
    if (type === ORDER_CREATE_REQUEST)
        return { ...state, loading: true };

    if (type === ORDER_CREATE_SUCCESS)
        return {
            loading: false,
            success: true,
            order: payload
        };

    if (type === ORDER_CREATE_FAIL)
        return {
            loading: false,
            error: payload
        };

    return state;
};


const orderDetailsInitial = {
    loading: true,
    order: {
        orderItems: [],
        shippingAddress: {}
    }
};
export const orderDetailsReducers = (state = orderDetailsInitial, { type, payload }) => {
    if (type === ORDER_DETAILS_REQUEST)
        return { ...state, loading: true };

    if (type === ORDER_DETAILS_SUCCESS)
        return {
            ...state,
            loading: false,
            order: payload
        };

    if (type === ORDER_DETAILS_CANCEL_SUCCESS)
        return {
            ...state,
            order: payload
        };

    if (type === ORDER_DETAILS_FAIL)
        return {
            loading: false,
            error: payload
        };

    if (type === ORDER_DETAILS_RESET)
        return {
            loading: false,
            error: payload
        };

    return state;
};

export const cancelMyOrderReducer = (state = { loading: false, error: '' }, { type, payload }) => {
    if (type === ORDER_DETAILS_CANCEL_REQUEST)
        return { ...state, loading: true, };

    if (type === ORDER_DETAILS_CANCEL_SUCCESS)
        return { ...state, loading: false };

    if (type === ORDER_DETAILS_CANCEL_FAIL)
        return { loading: false, error: payload };

    return state;
};

export const orderListMineReducer = (state = { orders: [] }, { type, payload }) => {
    if (type === ORDER_MY_LIST_REQUEST)
        return {
            loading: true,
        };

    if (type === ORDER_MY_LIST_SUCCESS)
        return {
            loading: false,
            orders: payload,
        };

    if (type === ORDER_MY_LIST_FAIL)
        return {
            loading: false,
            error: payload,
        };

    if (type === ORDER_MY_LIST_RESET)
        return { orders: [] };


    return state;

};