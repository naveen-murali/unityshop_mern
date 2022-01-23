import { SHOW_SUCCESS_ALERT, HIDE_ALERT, SHOW_ERROR_ALERT } from '../constants/mainAlertConstants';

export const mainAlertReducer = (state = { variant: '', message: '' }, { type, payload }) => {
    if (type === SHOW_SUCCESS_ALERT)
        return { variant: 'success', message: payload };
    
    if (type === SHOW_ERROR_ALERT)
        return { variant: 'danger', message: payload };

    if (type === HIDE_ALERT)
        return { variant: '', message: '' };
    
    return state;
};