const crypto = require('crypto');
const AppConstants = require('./../settings/constants');
const multer = require('multer');
const  upload = multer({ dest: 'uploads/' })

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
       app.dbs.users.findOne({key: req.query.key}, (err, user) => {
         if (!user) {
           return res.send(Utility.GenerateErrorMessage(
             Utility.ErrorTypes.PERMISSION_DENIED)
           );
         }
         req.user = user;
         return next();
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

  app.get('/api/users/',_auth('optional'), (req, res) => {
        app.dbs.users.find({})
            .populate('products',['name','group'])
            .skip(req.query.offset)
            .limit(req.query.limit)
            .exec( (err, data) => {
            if (err) {
              console.log(err);
                return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.SEARCH_ERROR));
            }

            return res.send(data.map(d => {
           return {
               username: d.username,
               id: d._id,
               age: d.age,
               name: d.name,
               email: d.email,
               key : d.key,
               products: d.products
            }
          }));
        })
      });

  app.post('/api/users/',_auth('optional'), (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let name = req.body.name;
    let email = req.body.email;
    let age = req.body.age;

    let uv_response = UserValidator.validateUsername(username,true);
    if(uv_response != Utility.ErrorTypes.SUCCESS) {
      return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.uv_response))
    }

    let pas_response = UserValidator.validatePassword(password)
    if(pas_response != Utility.ErrorTypes.SUCCESS) {
      return  res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.pas_response));
    }

    let name_response = UserValidator.validateName(name)
    if(name_response != Utility.ErrorTypes.SUCCESS) {
      return  res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.name_response));
    }

    if(age < AppConstants.AGE_MIN_LENGTH || age > AppConstants.AGE_MAX_LENGTH) {
      return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.INVALID_AGE_RANGE));
    }

    if(EmailValidator.validator(email) === false) {
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

  app.put('/api/users/:id',_auth('user'), (req, res) => {
     app.dbs.users.find({_id: req.params.id},(err,data) => {
      if(err) {
        return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.EMPTY_ID_FOUND));
      }
      let username = req.body.username;
      let key = req.query.key;
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
      if(uv_response != Utility.ErrorTypes.SUCCESS) {
        return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.uv_response))
      }

      let pas_response = UserValidator.validatePassword(password)
      if(pas_response != Utility.ErrorTypes.SUCCESS) {
        return  res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.pas_response));

      if(name.length < AppConstants.NAME_MIN_LENGTH || name.length > AppConstants.NAME_MAX_LENGTH) {
        return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.INVALID_NAME_RANGE));
      }
      if(age < AppConstants.AGE_MIN_LENGTH || age > AppConstants.AGE_MAX_LENGTH) {
        return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.INVALID_AGE_RANGE));
      }
      if(EmailValidator.validator(email) === false) {
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
          }});
        });

  app.delete('/api/users/:id',_auth('admin'), (req, res) => {
    if (!req.params.id) {
      return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.EMPTY_ID_DELETE));
    }
    app.dbs.users.findOneAndRemove({ _id: req.params.id}, (err, data) => {
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


  app.get('/api/products/',_auth('optional'), (req, res) => {
    app.dbs.products.find({}, (err, data) => {
      if (err) {
        return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.SEARCH_ERROR));
      }

      return res.send(data.map(d => {
        return {
            name: d.name,
            group: d.group,
            importance: d.importance,
            isDeleted: d.isDeleted
            //img: d.img,
          }
        }));
      })
    });

  app.post('/api/products/',_auth('optional'), (req, res) => {
    let name = req.body.name;
    let group = req.body.group;
    let importance = req.body.importance;
    //let img = req.body.img;
    if (!['dairy','fruits','meats','fish','sweets','juice','alcoholic'].includes(group)) {
      return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.ERROR_PRODUCTS_GROUP));
    }

    if (!['very','middle','less'].includes(importance)) {
      return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.ERROR_IMPORTANCE));
    }

    if (name.length > AppConstants.NAME_MAX_LENGTH || name.length < AppConstants.NAME_MIN_LENGTH) {
      return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.INVALID_NAME_RANGE));
    }
    app.dbs.products.findOne({name: name}, (err,data)=>{
      if (data) {
        return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.PRODUCT_REPEAT));
      }
      app.dbs.products.create({
        name: name,
        group: group,
        importance: importance
        //img: img
      }, (err, data) => {
        if (err) {
          console.log(err);
            return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.ERROR_CREATION_PRODUCT));
          }
          let product = {
            name: data.name,
            _id: data._id,
            group: data.group,
            importance: data.importance
            //img: data.img
          }
          return res.send(product);
        })
      });
    });

  app.delete('/api/products/',_auth('optional'), (req, res) => {
    if (!req.query.id)  {
      return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.EMPTY_PRODUCTS_DELETE));
    }
    app.dbs.products.findOne({
      _id: req.query.id
    }, (err, data) => {
      if (err) {
          return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.ERROR_IN_PRODUCT_DELETING));
        }
        if (data.isDeleted === true) {
          return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.ISDELETED_ERROR));
        }

        app.dbs.products.update({_id: req.query.id},{$set:{isDeleted: true}},(err,data)=> {
          if(err) {
              return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.ERROR_IN_DELETING_PRODUCT));
            }
            app.dbs.products.findOne({_id:req.query.id},(err,data)=> {
              return res.send(data);
            })
          });
        });
      });

  app.put('/api/products/:id', _auth('optional'), (req, res) => {
      app.dbs.products.findOne({_id: req.params.id }, (err, data) => {
        if (err) {
          return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.NO_SUCH_PRODUCT_UPDATE));
        }
        let product = {
          name: req.body.name,
          group: req.body.group,
          importance: req.body.importance,
          id: data._id,
          isDeleted: req.body.isDeleted
        };
        product.name ? product.name = req.body.name : product.name = data.name;
        product.group ? product.group = req.body.group : product.group = data.group;
        product.importance ? product.importance = req.body.importance : product.importance = data.importance;
        product.isDeleted ? product.isDeleted = req.body.isDeleted : product.isDeleted = data.isDeleted;

        if (!['dairy','fruits','meats','fish','sweets','juice','alcoholic'].includes(product.group)) {
          return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.ERROR_PRODUCTS_GROUP));
        }

        if (!['very','middle','less'].includes(product.importance)) {
          return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.ERROR_IMPORTANCE));
        }
        /*  app.dbs.products.findOne({name: product.name}, (err,data)=>{
        if(data) {
        if(data.id !== product.id){
          return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.PRODUCTS_EXISTS));
        }
      }
    });*/
    app.dbs.products.update({_id:product.id},{$set:{name : product.name, group : product.group, importance : product.importance, isDeleted : product.isDeleted }},
      (err, value) => {
        if(err) {
              return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.PRODUCTS_UPDATE_ERROR));
            }
            app.dbs.products.findOne({_id:product.id}, (err,data)=> {
              let product = {
                name: data.name,
                group: data.group,
                importance: data.importance,
                id: data._id,
                isDeleted: data.isDeleted
              };
              return res.send(product);
            })
          });
        });
      });


  app.get('/api/shoplist/',_auth('optional'), (req, res) => {
    app.dbs.shoplist.find({isActive: true})
    .populate('products',['name','group'])
    .exec( (err, data) => { console.log(data);
      if (err) {
        console.log(err);//TODO write this error on log file
        return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.NO_SHOP_LIST));
      }

      return res.send(data.map(d => {
        return {
          listname: d.list_name,
          id: d._id,
          products: d.products
        }
      }));
    })
  });

  app.post('/api/shoplist', _auth('optional'), (req, res) => {
    let list_name = req.body.list_name;
    if (list_name.length < AppConstants.LIST_NAME_MIN_LENGTH || list_name.length > AppConstants.LIST_NAME_MAX_LENGTH) {
      return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.INVALID_LIST_NAME_LENGTH));
    }

    app.dbs.shoplist.create({
      list_name: list_name
    },(err,data)=> {
      if(err) {
        return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.ERROR_CREATION_SHOPLIST));
      }
      let shoplist = {
        list_name: data.list_name,
        isActive: data.isActive,
        _id:data._id,
        products: data.products
      };
      return res.send(shoplist);
    });
  });

  app.delete('/api/shoplist/',_auth('optional'), (req, res) => {
    if (!req.query.id) {
      return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.EMPTY_SHOPLIST_DELETE));
    }
    app.dbs.shoplist.findOne({
      _id: req.query.id
    }, (err, data) => {
      if (err) {
          return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.ERROR_IN_SHOPLIST_DELETING));
        }
        if (data.isActive === false) {
          return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.IS_NOT_ACTIVE));
        }

        app.dbs.shoplist.update({_id: req.query.id},{$set:{isDeleted: true}}, (err,data) => {
          if(err) {
              return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.ERROR_IN_SHOPLIST_DELETING));
            }
            app.dbs.shoplist.findOne({_id:req.query.id},(err,data)=> {
              return res.send(data);
            })
          });
        });
      });

  app.put('/api/shoplist/:id', _auth('optional'), (req, res) => {
    app.dbs.shoplist.findOne({_id: req.params.id }, (err, data) => {
      if (err) {
        return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.NO_SUCH_SHOPLIST_UPDATE));
      }

      let shoplist = {
        list_name: req.body.list_name,
        isActive: req.body.isActive,
        products: req.body.products
      };
      shoplist.lsit_name ? shoplist.list_name = req.body.list_name : shoplist.list_name = data.list_name;
      shoplist.isActive ? shoplist.isActive = req.body.isActive : shoplist.isActive = data.isActive;

      if (shoplist.products) {
        app.dbs.shoplist.update({_id: req.params.id},{$push:{products:shoplist.products}},(err,data)=> {
          if(err) {
            return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.SHOPLIST_UPDATE_ERROR));
          }
        });
      }

      app.dbs.shoplist.update({_id:req.params.id},{$set:{list_name : shoplist.list_name, isActive: shoplist.isActive }},
        (err, value) => {
          if (err) {
              console.log(err);
              return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.SHOPLIST_UPDATE_ERROR));
            }
            app.dbs.products.findOne({_id:req.params.id}, (err,data)=> {
              if (err) {
                console.log(err);
                return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.ERROR_FINDING_SHOPLIST));;
              }
              return res.send(data);
            })
          });
        });
      });

  app.post('/api/photos', upload.single('avatar'), (req,res) => {
    if(!req.file) {
      return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.NO_PHOTO));
    }
    if (!req.file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.NO_PHOTOS_TYPE))
    }
    console.log(file.Buffer);

      let content_type= req.file.content_type
      let size = req.file.size;
      let filename = req.file.filename;
      let buffer = req.file.buffer;
      let width = req.body.width;
      let height = req.body.height;
    app.dbs.photos.create({
              image: buffer,
              content_type: content_type,
              size: size,
              width: width,
              height: height,
              title: filename

    }, (err,data) => {
      if(err) {
        console.log(err);//TODO create error.log file
        return res.send(Utility.GenerateErrorMessage(Utility.ErrorTypes.ERROR_IN_ADDING_PHOTO));
      }
      return res.send(data);
    });
  });
}
