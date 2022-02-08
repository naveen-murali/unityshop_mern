import {
    SALES_LIST_REQUEST,
    SALES_LIST_SUCCESS,
    SALES_LIST_FAIL
} from '../constants/salesContants';
import { USER_LOGOUT } from '../constants/userConstants';

export const salesListReducer = (state = { sales: [] }, { type, payload }) => {
    if (type === SALES_LIST_REQUEST)
        return { ...state, loading: true };

    if (type === SALES_LIST_SUCCESS)
        return {
            ...state,
            loading: false,
            sales: payload
        };

    if (type === SALES_LIST_FAIL)
        return { loading: false, error: payload };

    if (type === USER_LOGOUT)
        return { sales: [] };

    return state;
};