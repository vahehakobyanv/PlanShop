const express = require('express');
const UsersRouter = express.Router();
const crypto = require('crypto');

const Utility = require('./../../services/utility');
const UsersService = require('./service');

//GET
UsersRouter.get('/', (req, res) => {
  if (!req.query.key) {
    return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.SEARCH_ERROR));
  }
    UserService.getUsers().then(data => {
      return res.send(data);
    });
});

//POST
UsersRouter.post('/', (req, res) => {
  let user {
      username = req.body.username;
      password = req.body.password;
      name = req.body.name;
      email = req.body.email;
      age = req.body.age;

  }
  let uv_response = UserValidator.validateUsername(username, true) ;
  if (uv_response != Utility.ErrorTypes.SUCCESS) {
      return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.uv_response));
  }

  let pas_response = UserValidator.validatePassword(password)
  if (pas_response != Utility.ErrorTypes.SUCCESS) {
      return res.send(Utylity.GenerateErrorMessage(Utylity.ErrorTypes.pas_response));
  }
  let name_response = UserValidator.validateName(name)
  if (name_response != Utility.ErrorTypes.SUCCESS) {
    return  res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.name_response));
  }

  if (age < AppConstants.AGE_MIN_LENGTH || age > AppConstants.AGE_MAX_LENGTH) {
    return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.INVALID_AGE_RANGE));
  }

  if (EmailValidator.validator(email) === false) {
    return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.EMAIL_ERROR));
  }

  password = createHash('md5').update(password + username).digest('hex');

  UserService.insertUsers(user).then(data => {
      return res.send(data);
  });

});

UsersRouter.put('/:id', (req, res) => {
    if (req.user.role != 'admin') {
      if (req.params.id != req.user.id) {
        return res.send(Utylity.GenerateErrorMessage(Utylity.ErrorTypes.PERMISSION_DENIED));
      }
    }
    if (err) {
      return res.send (Utylity.GenerateErrorMessage(Utylity.ErrorTypes.EMPTY_ID_FOUND));
    }
let user {
    username = req.body.username;
    key = req.query.key;
    password = req.body.password;
    name = req.body.name;
    email = req.body.email ;
    age = parseInt(req.body.age);
 }
    username ? username = req.body.username : username = data.username;
    password ? password = req.body.password : password = data.password;
    name ? name = req.body.name : name = data.name;
    email ? email = req.body.email : email = data.email;
    age ? age = parseInt(req.body.age) : age = parseInt(data.age);

    let uv_response = UserValidator.validateUsername(username);
    if (uv_response != Utility.ErrorTypes.SUCCESS) {
      return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.uv_response));
    }

    let pas_response = UserValidator.validatePassword(password);
    if (pas_response != Utility.ErrorTypes.SUCCESS) {
      return  res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.pas_response));
    }

    if (name.length < AppConstants.NAME_MIN_LENGTH || name.length > AppConstants.NAME_MAX_LENGTH) {
      return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.INVALID_NAME_RANGE));
    }
    if (age < AppConstants.AGE_MIN_LENGTH || age > AppConstants.AGE_MAX_LENGTH) {
      return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.INVALID_AGE_RANGE));
    }
    if (EmailValidator.validator(email) === false) {
      return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.EMAIL_ERROR));
    }

    password = crypto.createHash('md5').update(username + password).digest('hex');
    UserService.updateUsers(id, user).then(data => {
      return res.send(data);
    });
});

 UsersRouter.delete('/:id', (req, res) => {
   if (!req.params.id) {
     return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.EMPTY_ID_DELETE));
   }
   UserService.updateUsers({_id:id}).then(data => {
      return res.send(data);
   });
 });

module.exports = UsersRouter;
