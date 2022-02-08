import axios from 'axios';
import {
    SALES_LIST_REQUEST,
    SALES_LIST_SUCCESS,
    SALES_LIST_FAIL
} from '../constants/salesContants';
import { showErrorAlert } from './mainAlertActions';
import { logout } from './userActions';

const fromDate = () => {
    const d = new Date();
    d.setDate(d.getDate()-1);
    d.setSeconds(0);
    d.setMilliseconds(0);
    d.setHours(0);
    d.setMinutes(0);

    return d;
};
const toDate = () => {
    const d = new Date();
    d.setDate(d.getDate());
    d.setHours(11);
    d.setSeconds(59);
    d.setMilliseconds(59);
    d.setMinutes(59);

    return d;
};


export const getSalesList = (from = '', to = '') => async (dispatch, getState) => {
    try {
        // const { sales } = getState().salesList;

        // if (!sales.length)
            dispatch({ type: SALES_LIST_REQUEST });

        const { userLogin: { userInfo } } = getState();
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        if (!from && !to) {
            from = fromDate();
            to = toDate();
        }

        const { data } = await axios.get(`/api/sales?from=${from}&to=${to}`, config);

        dispatch({
            type: SALES_LIST_SUCCESS,
            payload: data
        });
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;

        dispatch({
            type: SALES_LIST_FAIL,
            payload: message
        });

        if (message === 'Not authorized, token failed' || message === 'Account has been blocked') 
            dispatch(logout());

        dispatch(showErrorAlert(message));
    }
};