export const NAME_CONFIG = {
    required: true,
    maxLength: 50,
    pattern: /^[a-zA-Z ]{3,}$/i
};

export const EMAIL_CONFIG = {
    required: true,
    pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i
};

export const PHONE_CONFIG = {
    required: true,
    pattern: /^[0-9]{10}$/i
};

export const PASSWORD_CONFIG = {
    required: true,
    pattern: /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[a-z]).*$/i
};