const UsersDao = require('./private/mongoDao');
const Utility = require('./../../services/utility');

class UsersService {

  getUsers() {
    return new Promise((resolve, reject) =>{
        UsersDao.getData()
        .skip(req.query.offset)
        .limit(req.query.limit)
        .then(data => {
            resolve(data);
        }).catch(err => {
          reject(Utylity.GenerateErrorMessage(
            Utylity.ErrorTypes.SEARCH_ERROR));
        });
    });

  }

  insertUsers(user) {
    return new Promise((resolve, reject) => {
      UsersDao.inserData ({
        username: user.username,
        password: user.password,
        email: user.email,
        name: user.name,
        age: user.age
      }). then(data => {
        resolve(data);
      }).catch(err => {
        reject(Utylity.GenerateErrorMessage(
        Utylity.ErrorTypes.ERROR_CREATION_USER));
      });
    });
  }

  updateUsers(id, user) {
    return new Promise((resolve, reject) => {
      UsersDao.updateData(id, user)
      .then(data => {
        resolve(data);
      }).catch(err => {
        reject(Utylity.GenerateErrorMessage(
        Utylity.ErrorTypes.USER_UPDATE_ERROR));
      });
    });
  }

  deleteUsers(id,user) {
    return new Promise((resolve, reject) => {
        UsersDao.deleteData(id, user)
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(Utylity.GenerateErrorMessage(
            Utylity.ErrorTypes.ERROR_IN_DELETING));
        });
    });
  }

}



module.exports = new UsersService();
