const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const Utility = require('./services/utility');
const AppConstants = require('./settings/constants')


app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended: true
}));

app.use(Utility.parseQuery);
require('./models/users');
require('./models/products');
require('./models/shoplist');
const con = mongoose.createConnection(AppConstants.DB_URL);

app.dbs = {
    users: con.model('users'),
    products: con.model('products'),
    shoplist: con.model('shoplist')
}
require('./controllers/api')(app);

app.listen(2222);
