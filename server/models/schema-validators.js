const validator = require('validator');

const phoneValidator = {
    validator: (value) => {
        return !value || validator.isMobilePhone(value, 'en-US');
    },
    message: '{VALUE} is not a valid phone number'
};

const emailValidator = {
    validator: (value) => {
        return validator.isEmail(value);
    },
    message: '{VALUE} is not a valid email'
};

module.exports = {
    phoneValidator,
    emailValidator
};