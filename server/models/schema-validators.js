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

const requireOnePhone = () => {
    const phones = [];

    if (this.phones.cell.number) {
        phones.push(this.phones.cell.number);
    }

    if (this.phones.home.number) {
        phones.push(this.phones.home.number);
    }

    if (this.phones.work.number) {
        phones.push(this.phones.work.number);
    }

    return phones.length > 0;
};

const requireOnePrimaryPhone = () => {
    const primaryPhones = [];

    if (this.phones.cell.isPrimary && this.phones.cell.number) {
        priamryPhones.push(this.phones.cell);
    }

    if (this.phones.home.isPrimary && this.phones.home.number) {
        priamryPhones.push(this.phones.home);
    }

    if (this.phones.work.isPrimary && this.phones.work.number) {
        priamryPhones.push(this.phones.work);
    }

    return primaryPhones.length === 1;
};

module.exports = {
    phoneValidator,
    emailValidator
};