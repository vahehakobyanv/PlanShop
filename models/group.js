const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const AppConstants = require('./../settings/constants');
const products = require('./products');

let GroupSchema = Schema({
  groupname: {
    type: String,
    index: {unique: true}
  },
  users: [{
    type: Schema.ObjectId,
    index: true,
    ref: 'users',
    default: null
  }],
  shoplists: [{
    type: Schema.ObjectId,
    index: true,
    ref: 'shoplist',
    default: null
  }],
  GroupOwner: {
    type: Schema.ObjectId,
    index: true,
  },
  isActive: {
    type: Boolean,
    default: true
  }
});
 
module.exports = mongoose.model('group', GroupSchema);
