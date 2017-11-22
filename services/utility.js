const AppConstants = require('./../settings/constants');

const ErrorTypes = {
  VALIDATION_ERROR: 'validation_error',
  SEARCH_ERROR: 'searching error',
  USER_EXISTS: 'user exists',
  SUCCESS: 'SUCCESS',
  USERNAME_PASS_MISSING: 'username pass missing',
  USERNAME_INVALID_RANGE: 'USERNAME_INVALID_RANGE',
  PASSWORD_INVALID_RANGE: 'PASSWORD_INVALID_RANGE',
  ERROR_CREATION_USER: 'error creation user',
  HAVE_USER: 'have user in this username',
  INVALID_NAME_RANGE: 'invalid range for name',
  NAME_MISSING: 'name missing',
  INVALID_AGE_RANGE: 'invalid range for age',
  ERROR_IN_DELETING: 'error in deleting',
  EMPTY_ID_DELETE: 'empty id in delete',
  EMPTY_ID_FOUND: 'empty id in update',
  EMAIL_ERROR: 'invalid email',
  PRODUCT_REPEAT: 'product repead',
  USER_UPDATE_ERROR: 'error in user update',
  ERROR_IMPORTANCE: 'error importance',
  ERROR_PRODUCTS_GROUP: 'error products group',
  ERROR_IN_PRODUCT_DELETING: 'error in product deleting',
  ERROR_IN_DELETING_PRODUCT: 'error in deleting product',
  ISDELETED_ERROR: 'isDeleted error',
  ERROR_CREATION_PRODUCT: 'error creation product',
  PERMISSION_DENIED: ' permission denied',
  NO_SUCH_PRODUCT_UPDATE: 'no such product update',
  PRODUCTS_EXISTS: 'products exist',
  PRODUCTS_UPDATE_ERROR: 'products update error',
  EMPTY_PRODUCTS_DELETE: 'empty products delete',
  LIST_REPEAT: 'list is repeat',
  SHOPLIST_ERROR: 'shop list error',
  ERROR_CREATION_SHOPLIST: 'error creation shoplist',
  EMPTY_SHOPLIST_DELETE: 'empty shoplist delete',
  ERROR_IN_SHOPLIST_DELETING: 'error in shoplist deleting',
  IS_NOT_ACTIVE: 'is not activ',
  SHOPLIST_UPDATE_ERROR: 'shoplist update error',
  ERROR_FINDING_SHOPLIST: 'error finding shoplist',
  ERROR_IN_FINDING_PHOTO_DELETING: 'error in finding photos',
  INVALID_LIST_NAME_LENGTH: 'invalid list name length',
  INVALID_GROUP_NAME_LENGTH: 'invalid group name range',
  ERROR_CREATION_GROUP: ' error in creation group',
  EMPTY_GROUP_DELETE: 'empty group deleting',
  ERROR_IN_GROUP_DELETING: 'error in deleting group',
  NO_SUCH_GROUP_UPDATE: 'no such group to update',
  GROUP_UPDATE_ERROR: 'group update error',
  ERROR_FINDING_GROUP: 'error in finding group',
  NO_GROUP: 'no group',
  NO_PHOTO: 'no photo',
  NO_PHOTOS_TYPE: 'no photos type',
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

  static GenerateErrorMessage(type, options) {
    let error_object = {
      type: type || ErrorTypes.UNKNOWN_ERROR,
      message: 'Something went wrong'
    }

    switch (type) {
      case ErrorTypes.SEARCH_ERROR:
           error_object.message = 'Something went wront in searching';
           break;
      case ErrorTypes.SUCCESS:
           error_object.message = 'Success!!!'
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
      case ErrorTypes.PRODUCT_REPEAT:
           error_object.message = 'product is a repead, pleas enter other product';
           break;
      case ErrorTypes.HAVE_USER:
           error_object.message = 'user already exists please enter other username';
           break;
      case ErrorTypes.INVALID_NAME_RANGE:
           error_object.message = 'Your name range is invalid';
           break;
      case ErrorTypes.NAME_MISSING:
           error_object.message = 'name are missing'
           break;
      case ErrorTypes.PERMISSION_DENIED:
           error_object.message = 'you didn`h have permission'
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
      case ErrorTypes.ERROR_IMPORTANCE:
           error_object.message = 'importance is not defined';
           break;
      case ErrorTypes.ERROR_CREATION_PRODUCT:
           error_object.message = 'error when you create new product';
           break;
      case ErrorTypes.EMPTY_PRODUCTS_DELETE:
           error_object.message = 'you try delete empty products please enter correct product name';
           break;
      case ErrorTypes.NO_PHOTO:
           error_object.message = 'no photo please enter photo';
           break;
      case ErrorTypes.ERROR_IN_FINDING_PHOTO_DELETING:
           error_object.message = 'no photo finding for deleteing';
           break;
      case ErrorTypes.NO_PHOTOS_TYPE:
           error_object.message = 'no photos type please enter photo';
           break;
      case ErrorTypes.ERROR_PRODUCTS_GROUP:
           error_object.message = 'there is not such a group';
           break;
      case ErrorTypes.ERROR_IN_PRODUCT_DELETING:
           error_object.message = 'error in product deleting time';
           break;
      case ErrorTypes.ERROR_IN_DELETING_PRODUCT:
           error_object.message = 'error in deleting product';
           break;
      case ErrorTypes.ISDELETED_ERROR:
           error_object.message = 'you trying delete deleting products';
           break;
      case ErrorTypes.NO_SUCH_PRODUCT_UPDATE:
           error_object.message = 'no such product to update, please enter correct product name';
           break;
      case ErrorTypes.PRODUCTS_EXISTS:
           error_object.message = 'product is alredy exists';
           break;
      case ErrorTypes.PRODUCTS_UPDATE_ERROR:
           error_object.message = 'product updating error';
           break;
      case ErrorTypes.LIST_REPEAT:
           error_object.message = 'list is repeting please enter other name';
           break;
      case ErrorTypes.USER_UPDATE_ERROR:
           error_object.message = 'error in update time';
           break;
      case ErrorTypes.SHOPLIST_ERROR:
           error_object.message = 'cannot find shoplist';
           break;
      case ErrorTypes.ERROR_CREATION_SHOPLIST:
           error_object.message = ' error in creation shoplist';
           break;
      case ErrorTypes.EMPTY_SHOPLIST_DELETE:
           error_object.message = 'there is no shoplist';
           break;
      case ErrorTypes.ERROR_IN_SHOPLIST_DELETING:
           error_object.message = 'error in deleting shoplist';
           break;
      case ErrorTypes.IS_NOT_ACTIVE:
           error_object.message = 'shoplist is not activ';
           break;
      case ErrorTypes.INVALID_LIST_NAME_LENGTH:
           error_object.message = 'invalid list name length';
           break;
      case ErrorTypes.INVALID_GROUP_NAME_LENGTH:
           error_object.message = 'invalid group name length';
           break;
      case ErrorTypes.ERROR_CREATION_GROUP:
           error_object.message = 'error in creation group';
           break;
      case ErrorTypes.ERROR_FINDING_GROUP:
           error_object.message = 'error in finding group';
           break;
      case ErrorTypes.EMPTY_GROUP_DELETE:
           error_object.message = 'empty group is deleting';
           break;
     case ErrorTypes.NO_GROUP:
           error_object.message = 'no group';
           break;
      case ErrorTypes.NO_SUCH_GROUP_UPDATE:
           error_object.message = 'no such group for update';
           break;
      case ErrorTypes.GROUP_UPDATE_ERROR:
           error_object.message = 'error group for update';
           break;
      case ErrorTypes.ERROR_IN_GROUP_DELETING:
           error_object.message = 'error in deleting group';
           break;
      case ErrorTypes.SHOPLIST_UPDATE_ERROR:
           error_object.message = ' error in update shoplist ';
           break;
      case ErrorTypes.ERROR_FINDING_SHOPLIST:
           error_object.message = 'error in find shoplist on db';
           break;
    }
    return error_object;
  }
}


module.exports = Utility;
module.exports.ErrorTypes = ErrorTypes;
