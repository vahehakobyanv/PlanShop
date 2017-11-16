const AppConstants = require('./../../settings/constants');

const Types = {
  STRING : 'string',
  NUMBER : 'number',
  DATE : 'date',
  SYMBOL : 'symbol'
}

class BaseValidator {

  constructor() {
    this.handlers = {};
    this.handlers[Types.STRING] = this._isString;
    this.handlers[Types.NUMBER] = this._isNumber;
    this.handlers[Types.SYMBOL] = this._isSymbol;
    this.handlers[Types.DATE] = this._isDate;
  }

  validator(str, type) {
    if(!this.handlers[type]) {
      return false;
    }
    return this.handlers[type](str);
  }

  _isString(str) {
     if (!str) {
       return false;
     }
     if (typeof(str) === 'string') {
       return true;
     }
     return false;
  }

  _isNumber(str) {
     if (!str) {
       return false;
     }
     let numberRegExp = AppConstants.NUMBER_REG_EXP;
     if (numberRegExp.test(str)) {
       return true;
     }
     return false;
  }

  _isDate(str) {
     if (!str) {
       return false;
     }
     if (Date.parse(str)) {
       return true;
     }
     return false;
  }

  _isSymbol(str) {
    if (!str) {
      return false;
    }
    let symbolRegExp = AppConstants.SYMBOL_REG_EXP;
    if (symbolRegExp.test(str)) {
      return true;
    }
    return false;
  }
}

module.exports = BaseValidator;
module.exports.Types = Types;
