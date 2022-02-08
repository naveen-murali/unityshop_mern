import axios from 'axios';
import {
    DASHBOARD_DETAILS_REQUEST,
    DASHBOARD_DETAILS_SUCCESS,
    DASHBOARD_DETAILS_FAIL,
} from '../constants/dashboardConstants';
import { showErrorAlert } from './mainAlertActions';
import { logout } from './userActions';

export const getDashboardData = () => async (dispatch, getState) => {
    try {
        dispatch({ type: DASHBOARD_DETAILS_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        const { data } = await axios.get('/api/dashboard', config);

        dispatch({
            type: DASHBOARD_DETAILS_SUCCESS,
            payload: data
        });
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;

        dispatch({
            type: DASHBOARD_DETAILS_FAIL,
            payload: message
        });

        if (message === 'Not authorized, token failed' || message === 'Account has been blocked')
            dispatch(logout());
        dispatch(showErrorAlert(message));
    }
};