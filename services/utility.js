const AppConstants = require('./../settings/constants');


const ErrorTypes = {
    VALIDATION_ERROR: 'validation_error',
    SEARCH_ERROR: 'searching error',
    USER_EXISTS: 'user exists',
    USERNAME_PASS_MISSING: 'username pass missing',
    USERNAME_INVALID_RANGE: 'USERNAME_INVALID_RANGE',
    PASSWORD_INVALID_RANGE: 'PASSWORD_INVALID_RANGE',
    ERROR_CREATION_USER: 'error creation user',
    HAVE_USER: 'have user in this username',
    INVALID_NAME_RANGE: 'invalid range for name',
    INVALID_AGE_RANGE: 'invalid range for age',
    ERROR_IN_DELETING: 'error in deleting',
    EMPTY_ID_DELETE: 'empty id in delete',
    EMPTY_ID_FOUND: 'empty id in update',
    EMAIL_ERROR: 'invalid email',
    USER_UPDATE_ERROR: 'error in user update',
    UNKNOWN_ERROR: 'unknown_error'
}
class Utility {
      static parseQuery(req, res, next) {
            req.query.offset = parseInt(req.query.offset);
            if(!isFinite(req.query.offset)) {
                  req.query.offset = AppConstants.OFFSET_DEFAULT_VALUE;
            }

            req.query.limit = parseInt(req.query.limit);
            if(!isFinite(req.query.limit)) {
                  req.query.limit = AppConstants.LIMIT_DEFAULT_VALUE;
            }
            next();
      }
      static GenerateErrorMessage(type,options) {
        let error_object = {
            type: type || ErrorTypes.UNKNOWN_ERROR,
            message: 'Something went wrong'
        }
        switch (type) {
          case ErrorTypes.SEARCH_ERROR:
               error_object.message = 'Something went wront in searching';
               break;
          case ErrorTypes.USERNAME_PASS_MISSING:
               error_object.message = 'username or password are missing please enter username and password';
               break;
          case ErrorTypes.USERNAME_INVALID_RANGE:
               error_object.message = 'Your username range is invalid ';
               break;
          case ErrorTypes.USER_EXISTS:
               error_object.message = 'have user in this username please enter other username';
               break;
          case ErrorTypes.PASSWORD_INVALID_RANGE:
               error_object.message = 'Your password range is invalid ';
               break;
          case ErrorTypes.ERROR_CREATION_USER:
               error_object.message = 'error when you create new user';
               break;
          case ErrorTypes.HAVE_USER:
               error_object.message = 'user already exists please enter other username';
               break;
          case ErrorTypes.INVALID_NAME_RANGE:
               error_object.message = 'Your name range is invalid';
               break;
          case ErrorTypes.INVALID_AGE_RANGE:
               error_object.message = 'Your age range is invalid';
               break;
          case ErrorTypes.ERROR_IN_DELETING:
               error_object.message = 'Error in deleting user';
               break;
          case ErrorTypes.EMAIL_ERROR:
               error_object.message = 'Invalid email please enter correct email';
               break;
          case ErrorTypes.EMPTY_ID_DELETE:
               error_object.message = 'you pass empty id please pass correct id';
               break;
          case ErrorTypes.EMPTY_ID_FOUND:
               error_object.message = 'in updating id is empty';
               break;
          case ErrorTypes.USER_UPDATE_ERROR:
               error_object.message = 'error in update time'
               break;
        }
          return error_object;
      }
}

module.exports = Utility;
module.exports.ErrorTypes =ErrorTypes;
