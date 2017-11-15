const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const products = require('./products');
const AppConstants = require('./../settings/constants');

let ShoplistSchema = Schema({
  list_name: {
      type: String,
      index: { unique: true}
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

module.exports = mongoose.model('shoplist', ShoplistSchema);
