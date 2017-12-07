const Utility = require('./../../services/utility');

class BaseDao {
  constructor(collection) {
    this.collection = collection;
  }

  getData(query) {
    if (!this.collection) {
        return res.send(Utility.generateErrorMessage(
          Utility.ErrorTypes.UNKNOWN_ERROR) //TODO change error type
        );
    }
    query = query || {};
    this.collection.find(query);
  }

  insertData(query) {
    if (!query) {
      return res.send(Utility.generateErrorMessage(
        Utility.ErrorTypes.UNKNOWN_ERROR) //TODO change error type
      );
    }
    this.collection.create(query);
  }

  updateData(id, query) {
    if (!query) {
      return res.send(Utility.generateErrorMessage(
        Utility.ErrorTypes.UNKNOWN_ERROR) //TODO change error type
      );
    }
    this.collection.update({_id: id}, {$set: query});
  }

  deleteData(id, query) {
    if (!query) {
      return res.send(Utility.generateErrorMessage(
        Utility.ErrorTypes.UNKNOWN_ERROR) //TODO change error type
      );
    }
    this.collection.findOneAndRemove({_id: id}, {$set: query});
  }
}

module.exports = BaseDao;
