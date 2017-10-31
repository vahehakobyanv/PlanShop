const BaseValidator = require('./base');
const Utility = require('./../utility');
const AppConstants = require('./../../settings/constants');
 class UserValidator extends BaseValidator {
    constructor() {
        super();
    }

    validateUsername(username) {
        if (!username) {
               return Utility.ErrorTypes.USERNAME_MISSING;
         }
       if (username.length < AppConstants.USERNAME_MIN_LENGTH
            || username.length > AppConstants.USERNAME_MAX_LENGTH)
       {
           return Utility.ErrorTypes.INVALID_USERNAME_RANGE;
        }

      return Utility.ErrorTypes.SUCCESS;
    }

    validatePassword(password, sanitize) {
      if (!password) {
           return Utility.ErrorTypes.PASSWORD_MISSING;
      }
      if (password.length < AppConstants.PASSWORD_MIN_LENGTH
          || password.length > AppConstants.PASSWORD_MAX_LENGTH)
                {
          return Utility.ErrorTypes.INVALID_PASSWORD_RANGE;
      }
       return Utility.ErrorTypes.SUCCESS;
    }

 }

 module.exports = new UserValidator();
