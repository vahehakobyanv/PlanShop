const crypto = require('crypto');
const AppConstants = require('./../settings/constants');
const Utility = require('./../services/utility');
const UserValidator = require('./../services/validators/user-validator');
const EmailValidator = require('./../services/validators/emailValidator');
module.exports = function(app) {
  function _auth(permission) {
   return function (req, res, next) {
     if (permission == 'optional') {
       return next();
     }
     if (permission == 'user') {
       console.log(req.query.key);
       app.dbs.users.findOne({key: req.query.key}, (err, user) => {
         if (!user) {
           return res.send(Utility.GenerateErrorMessage(
             Utility.ErrorTypes.PERMISSION_DENIED)
           );
         }
         console.log(user.id + " "+req.params.id)
         req.user = user;
         if(req.user.role == 'admin') {
         return next();
       }
       if(req.user.id == req.params.id) {
         return next();
       }
       return res.send(Utility.GenerateErrorMessage(
         Utility.ErrorTypes.PERMISSION_DENIED));
       });
     }
     if (permission == 'admin') {
       app.dbs.users.findOne({key: req.query.key, role: 'admin'}, (err, user) => {
             if (!user) {
               return res.send(Utility.GenerateErrorMessage(
                 Utility.ErrorTypes.PERMISSION_DENIED)
               );
             }
             req.user = user;
             return next();
           });
     }
   }
 }

 app.get('/users/',_auth('user'), (req, res) => {
    app.dbs.users.find({}, (err, data) => {
        if (err) {
            return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.SEARCH_ERROR));
        }

        return res.send(data.map(d => {
            return {
                username: d.username,
                id: d._id,
                age: d.age,
                name: d.name,
                email: d.email,
                key : d.key
            }
        }));
    })
});

app.post('/users/',_auth('optional'), (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let name = req.body.name;
  let email = req.body.email;
  let age = req.body.age;
  let uv_response = UserValidator.validateUsername(username,true);
  if(uv_response != Utility.ErrorTypes.SUCCESS)
  {
      return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.uv_response))
  }
  let pas_response = UserValidator.validatePassword(password)
  if(pas_response != Utility.ErrorTypes.SUCCESS)
  {
      return  res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.pas_response));
  }
  let name_response = UserValidator.validateName(name)
  if(name_response != Utility.ErrorTypes.SUCCESS)
  {
      return  res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.name_response));
  }
  if(age < AppConstants.AGE_MIN_LENGTH || age > AppConstants.AGE_MAX_LENGTH) {
      return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.INVALID_AGE_RANGE));
  }
  if(EmailValidator.validator(email) === false)
  {
      return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.EMAIL_ERROR));
  }
  password = crypto.createHash('md5').update(password+username).digest('hex');
  app.dbs.users.findOne({username: username}, (err,data)=>{
    if(data) {
        return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.USER_EXISTS));
    }
    app.dbs.users.create({
        username: username,
        password: password,
        age: age,
        email: email,
        name: name

    }, (err, data) => {
        if (err) {
          console.log(err);
            return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.ERROR_CREATION_USER));
        }
        let user = {
          username: data.username,
          _id: data._id,
          age: data.age,
          name: data.age,
          email: data.email,
          key: data.key
        }
        return res.send(user);
    })
  });

});


app.put('/users/:id',_auth('user'), (req, res) => {
  app.dbs.users.find({_id: req.params.id},(err,data) => {
    if(err) {
      return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.EMPTY_ID_FOUND));
    }
    let username = req.body.username;
    let key = data.key;
    let password = req.body.password;
    let name = req.body.name;
    let email = req.body.email ;
    let age = parseInt(req.body.age);
     username ? username = req.body.username :username = data.username;
     password ? password = req.body.password : password =data.password;
     name ? name = req.body.name : name = data.name;
     email ? email = req.body.email : email =data.email;
     age ? age = parseInt(req.body.age) : age = parseInt(data.age);
     let uv_response = UserValidator.validateUsername(username);
     if(uv_response != Utility.ErrorTypes.SUCCESS)
     {
         return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.uv_response))
     }
     let pas_response = UserValidator.validatePassword(password)
     if(pas_response != Utility.ErrorTypes.SUCCESS)
     {
         return  res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.pas_response));
     }
    if(name.length < AppConstants.NAME_MIN_LENGTH || name.length > AppConstants.NAME_MAX_LENGTH) {
        return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.INVALID_NAME_RANGE));
    }
    if(age < AppConstants.AGE_MIN_LENGTH || age > AppConstants.AGE_MAX_LENGTH) {
        return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.INVALID_AGE_RANGE));
    }
    if(EmailValidator.validator(email) === false)
    {
        return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.EMAIL_ERROR));
    }
    password = crypto.createHash('md5').update(password+username).digest('hex');
    app.dbs.users.findOne({username: username}, (err,data)=>{
      if(data) {
        if(data.id !== res.send.id){
          return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.USER_EXISTS));
        }
      }
    });
    console.log('username:' +username+'name :' +name+'age :'+ age+'email :'+email+'password :'+ password)
      app.dbs.users.update({_id:req.params.id},{$set:{username: username,name : name,age : age, email : email, password : password,key: key }},
      (err, value) => {
     if(err) {
       console.log(err);
                return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.USER_UPDATE_ERROR));
              }
              let user = {
                username: username,
                _id: req.params.id,
                age: age,
                name: age,
                email: email
              }
              return res.send(user);
           });
         });
  });



app.delete('/users/:id',_auth('admin'), (req, res) => {
  if(!req.params.id)
  {
    return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.EMPTY_ID_DELETE));
  }
  app.dbs.users.findOneAndRemove({
      _id: req.params.id
  }, (err, data) => {
      if (err) {
          return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.ERROR_IN_DELETING));
      }
      return res.send(data.map(d => {
          return {
              username: d.username,
              id: d._id,
              age: d.age,
              name: d.name,
              email: d.email,
              key : d.key
          }
      }));
  })
});
}
