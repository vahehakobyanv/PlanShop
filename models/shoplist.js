const mongoose = require ('mongoose');
const Schema = mongoose.Schema;


const AppConstants = require('./../settings/constants');
const products = require('./products');

let ShoplistSchema = Schema ({
  listname: {
    type: String,
    index: {unique: true}
  },
  products: [{
      type: Schema.ObjectId,
      index: true,
      ref: 'products',
      default: null
  }],
  isActive: {
    type: Boolean,
    default: true
  }
});


module.exports = mongoose.model('shoplist',ShoplistSchema);
