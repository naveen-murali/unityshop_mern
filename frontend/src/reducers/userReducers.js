import {
    USER_DETAILS_FAIL,
    USER_DETAILS_REQUEST,
    USER_DETAILS_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGOUT,
    USER_REGISTER_FAIL,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_UPDATE_PROFILE_FAIL,
    USER_UPDATE_PROFILE_REQUEST,
    USER_UPDATE_PROFILE_SUCCESS,
    USER_CHANGE_WISHLIST_COUNT,
    USER_VARIFIED,
    USER_LIST_REQUEST,
    USER_LIST_SUCCESS,
    USER_LIST_FAIL,
    USER_DELETE_REQUEST,
    USER_DELETE_SUCCESS,
    USER_DELETE_FAIL,
    USER_UPDATE_REQUEST,
    USER_UPDATE_SUCCESS,
    USER_UPDATE_FAIL
} from '../constants/userConstants';

export const userLoginReducer = (state = {}, { type, payload }) => {
    if (type === USER_LOGIN_REQUEST)
        return { loading: true };

    if (type === USER_LOGIN_SUCCESS || type === USER_VARIFIED)
        return { loading: false, userInfo: payload };

    if (type === USER_LOGIN_FAIL)
        return { loading: false, error: payload };

    if (type === USER_LOGOUT)
        return {};

    if (type === USER_CHANGE_WISHLIST_COUNT) {
        const { userInfo } = state;
        userInfo.wishlistCount = payload;
        return { ...state, userInfo };
    }

    return state;
};

export const userRegisterReducer = (state = {}, { type, payload }) => {
    if (type === USER_REGISTER_REQUEST)
        return { ...state, loading: true };

    if (type === USER_REGISTER_SUCCESS)
        return { loading: false, userInfo: payload };

    if (type === USER_REGISTER_FAIL)
        return { loading: false, error: payload };

    if (type === USER_LOGOUT)
        return {};

    return state;
};


export const userDetailsReducer = (state = { user: {} }, { type, payload }) => {
    if (type === USER_DETAILS_REQUEST)
        return { loading: true };

    if (type === USER_DETAILS_SUCCESS)
        return { loading: false, user: payload };

    if (type === USER_DETAILS_FAIL)
        return { loading: false, error: payload };

    if (type === USER_LOGOUT)
        return { user: {} };

    return state;
};


export const userUpdateProfileReducer = (state = {}, { type, payload }) => {
    if (type === USER_UPDATE_PROFILE_REQUEST)
        return { loading: true };

    if (type === USER_UPDATE_PROFILE_SUCCESS)
        return { loading: false, user: payload };

    if (type === USER_UPDATE_PROFILE_FAIL)
        return { loading: false, error: payload };

    return state;
};

const userListInitial = { users: [] };
export const userListReducer = (state = userListInitial, { type, payload }) => {
    if (type === USER_LIST_REQUEST)
        return { ...state, loading: true };

    if (type === USER_LIST_SUCCESS)
        return {
            loading: false,
            users: payload.users,
            page: payload.page,
            pages: payload.pages
        };

    if (type === USER_LIST_FAIL)
        return { loading: false, error: payload };

    if (type === USER_LOGOUT)
        return userListInitial;

    return state;
};

export const userDeleteReducer = (state = {}, { type, payload }) => {
    if (type === USER_DELETE_REQUEST)
        return { loading: true };

    if (type === USER_DELETE_SUCCESS)
        return { loading: false, success: true };

    if (type === USER_DELETE_FAIL)
        return { loading: false, error: payload };

    return state;
};

export const userUpdateReducer = (state = {}, { type, payload }) => {
    if (type === USER_UPDATE_REQUEST)
        return { loading: true };

    if (type === USER_UPDATE_SUCCESS)
        return { loading: false, success: true };

    if (type === USER_UPDATE_FAIL)
        return { loading: false, error: payload };

    return state;
};
