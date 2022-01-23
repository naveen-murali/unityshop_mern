import { SHOW_SUCCESS_ALERT, HIDE_ALERT, SHOW_ERROR_ALERT } from '../constants/mainAlertConstants';

export const showSuccessAlert = (message) => {
    return {
        type: SHOW_SUCCESS_ALERT,
        payload: message
    };
};

export const showErrorAlert = (message) => {
    return {
        type: SHOW_ERROR_ALERT,
        payload: message
    };
};

export const hideAlert = () => {
    return { type: HIDE_ALERT };
};