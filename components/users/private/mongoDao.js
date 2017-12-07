const mongoose = require('mongoose');

const BaseDao = require('./../../core/BaseDao');
const connect = require('./../../core/DbConnection');
const model = require('./model');


class UsersDao extends BaseDao {
    constructor() {
      super(connect.model('users'));
    }

    inserData(query) {
      if(!query) {
        return res.send(Utylity.GenerateErrorMessage(
          Utylity.ErrorTypes.SEARCH_ERROR)); //TODO change error type
      }
      connect.model('users').findOne({username: query.username || email: query.email}, (err, data) => {
          if (data) {
            return res.send(Utylity.GenerateErrorMessage(
              Utylity.ErrorTypes.SEARCH_ERROR));  //TODO change error type
          }
      });
      connect.model('users').create(query);
    }
}

module.exports = new UsersDao();
