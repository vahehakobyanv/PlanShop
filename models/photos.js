const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const AppConstants = require('./../settings/constants');

let photosSchema = Schema ({
  image: {
      type: Buffer,
      index: { unique: true}
  },
  content_type: {
    type: String
  },
  size: {
    type:Number
  },
  width: {
    type: Number
  },
  height: {
    type: Number
  },
  title: {
    type: String
  }
});

module.exports = mongoose.model('photos',photosSchema);
