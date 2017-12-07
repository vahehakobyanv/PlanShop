const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const AppConstants = require('./../../settings/constants');
module.exports = mongoose.createConnection(AppConstants.DB_URL);
