import {
    DASHBOARD_DETAILS_REQUEST,
    DASHBOARD_DETAILS_SUCCESS,
    DASHBOARD_DETAILS_FAIL,
} from '../constants/dashboardConstants';
import { USER_LOGOUT } from '../constants/userConstants';

const dashboardInitializer = {
    thisWeekOrders: [],
    allOrders: 0,
    newOrders: 0,
    allUsers: 0,
    newUsers: 0
};
export const dasboardReducer = (state = dashboardInitializer, { type, payload }) => {
    if (type === DASHBOARD_DETAILS_REQUEST)
        return { ...state, loading: true };

    if (type === DASHBOARD_DETAILS_SUCCESS)
        return {
            ...state,
            loading: false,
            thisWeekOrders: payload.thisWeekOrders,
            allOrders: payload.allOrders,
            newOrders: payload.newOrders,
            allUsers: payload.allUsers,
            newUsers: payload.newUsers,
            brandStatus: payload.brandStatus,
            totalRevenue: payload.totalRevenue,
            todaysRevenue: payload.todaysRevenue,
        };

    if (type === DASHBOARD_DETAILS_FAIL)
        return {
            ...dashboardInitializer,
            loading: false,
            error: payload
        };

    if (type === USER_LOGOUT)
        return dashboardInitializer;

    return state;
};