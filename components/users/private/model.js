const mongoose = require ('mongoose');
const keygen = require('keygenerator');
const Schema = mongoose.Schema;

//const products = require('./products');
//const shoplist = require('./shoplist');
const AppConstants = require('./../../../settings/constants');
const EmailValidator = require('./../../../services/validators/emailValidator');


function generateAPIKey() {
  return (keygen._({length: 2}) + '-' + keygen._({length: 6})
        + '-' + keygen.number()
        + '-' + keygen._({length: 6})
        + '-' + keygen._({length: 8})).replace(/&/g, '');
}

let userSchema = Schema({
  key: {
      type: String,
      default: generateAPIKey
  },

  username: {
      type: String,
      index: {unique: true},
      minLength: AppConstants.USERNAME_MIN_LENGTH,
      maxLength: AppConstants.USERNAME_MAX_LENGTH
  },

  age: {
      type: Number,
      default: null,
      minLength: AppConstants.AGE_MIN_LENGTH,
      maxLength: AppConstants.AGE_MAX_LENGTH
  },

  password: {
      type: String,
  },

  email: {
      type: String,
      lowercase: true,
      minLength: AppConstants.EMAIL_MIN_LENGTH,
      maxLength: AppConstants.EMAIL_MAX_LENGTH,
  },

  name: {
      type: String,
      minLength: AppConstants.NAME_MIN_LENGTH,
      maxLength: AppConstants.NAME_MAX_LENGTH,
      default: null
  },

  role: {
      type: String,
      enum: ['user','admin'],
      default: 'user'
  }/*,

  products: [{
      type: Schema.ObjectId,
      index: true,
      ref: 'products',
      default: null
  }],

  shoplist: [{
      type:String,
      index: true,
      ref: 'shoplist',
      default: null
  }]*/
});

module.exports = mongoose.model('users', userSchema);
