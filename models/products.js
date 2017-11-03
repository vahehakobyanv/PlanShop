const mongoose = require ('mongoose');
const Schema = mongoose.Schema;


const AppConstants = require('./../settings/constants');

let productSchema = Schema ({
  name: {
    type: String,
    index: {unique: true}
  },
  group: {
    type: String,
    index: { unique: true},
    enum: ['dairy','fruits','meats','fish','sweets','juice','alcoholic']
  },
  importance: {
    type: String,
    enum: ['very','middle','less'],
  },
  /*img: {
    type: Picture
    //TODO default value for img
  },*/
  isDeleted: {
    type: Boolean,
    default: false
  }
});


module.exports = mongoose.model('products',productSchema);
