import {
    WISHLIST_REQUESTS,
    WISHLIST_SUCCESS,
    WISHLIST_FAIL,
    WISHLIST_RESET
} from '../constants/wishslistConstants.js';


const wishlistInitial = { wishlistItems: [], loading: false };
export const wishlistReducer = (state = wishlistInitial, { type, payload }) => {
    if (type === WISHLIST_REQUESTS)
        return {
            ...state, loading: true
        };

    if (type === WISHLIST_SUCCESS)
        return {
            loading: false,
            wishlistItems: payload
        };

    if (type === WISHLIST_FAIL)
        return {
            ...state,
            loading: false,
            error: payload
        };

    if (type === WISHLIST_RESET)
        return wishlistInitial;

    return state;
};