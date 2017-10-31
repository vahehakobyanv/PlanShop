const crypto = require('crypto');
const AppConstants = require('./../settings/constants');
const Utility = require('./../services/utility');
const UserValidator = require('./../services/validators/user-validator');
const EmailValidator = require('./../services/validators/emailValidator');
module.exports = function(app) {
    function _auth(permission)
    {
        return function(req,res,next) {
            if(permission == 'optional') {
                next();
            }
            if(permission == 'user') {
                if (app.dbs.users.findOne({key: req.query.key,role: 'admin'})) {
                    next();
                }
                if (app.dbs.users.findOne({key: req.query.key,role: 'user'})) {
                    if (data._id == req.params._id) {
                        next();
                    }
                }
            }
        }
    }

 app.get('/users/',_auth('optional'), (req, res) => {
    app.dbs.users.find({}, (err, data) => {
        if (err) {
            return res.send('Something went wrong..');
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
  if(name.length < AppConstants.NAME_MIN_LENGTH || name.length > AppConstants.NAME_MAX_LENGTH) {
      return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.INVALID_NAME_RANGE));
  }
  if(age < AppConstants.AGE_MIN_LENGTH || age > AppConstants.AGE_MAX_LENGTH) {
      return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.INVALID_AGE_RANGE));
  }
  if(EmailValidator.validate(email) === false)
  {
      return res.send('invalid email');
  }
  password = crypto.createHash('md5').update(password+username).digest('hex');
  app.dbs.users.findOne({username: username}, (err,data)=>{
    if(data) {
        return res.send('user already exists');
    }
    app.dbs.users.create({
        username: username,
        password: password,
        age: age,
        email: email,
        name: name

    }, (err, data) => {
        if (err) {
            return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.ERROR_CREATION_USER));
        }
        return res.send(data);
    })
  });

});


app.put('/users/:id',_auth('optional'), (req, res) => {
  app.dbs.users.find({_id: req.params.id},(err,data) => {
    if(err) {
      return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.EMPTY_ID_FOUND));
    }
    let username = req.body.username;
    let password = req.body.password;
    let name = req.body.name;
    let email = req.body.email ;
    let age = parseInt(req.body.age);
     username ? username = req.body.username :username = data.username;
     password ? password = req.body.password : password =ata.password;
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
    password = crypto.createHash('md5').update(password+username).digest('hex');
    app.dbs.users.findOne({username: username}, (err,data)=>{
      if(data) {
        if(data.id !== res.send.id){
          return res.send('user already exists');
        }
      }
    });
    console.log('username:' +username+'name :' +name+'age :'+ age+'email :'+email+'password :'+ password)
      app.dbs.users.update({_id:req.params.id},{$set:{username: username,name : name,age : age, email : email, password : password }},
      (err, value) => {
     if(err) {
       console.log(err);
                return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.USER_UPDATE_ERROR));
              }
              return res.send(value);
           });
         });
  });



app.delete('/users/:id',_auth('optional'), (req, res) => {
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
      return res.send(data);
  })
});
}
