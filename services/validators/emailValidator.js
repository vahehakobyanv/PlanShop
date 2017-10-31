const BaseValidator = require('./base');
const Utility = require('./../utility');
const AppConstants = require('./../../settings/constants');
class EmailValidator extends BaseValidator {
    constructor() {
        super();
    }
    validate(email) {

            if(!email)
                return false;
            let ValidemailRegExp = AppConstants.EMAIL_REG_EXP;
            if(ValidemailRegExp.test(email))
                return true;
            return false;
        }

    }
    module.exports = new EmailValidator();

