var db = require('../db');
const bcrypt = require('bcrypt');

var User = function (user) {
    this.email = user.email;
    this.password = user.password;
}

User.signup = (req, res, next) => {
    console.log("req", req.body.password);
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        console.log("hash", hash);
        const user = {
          email: req.body.email,
          password: hash
        };
        console.log("user", user);
        console.log("query", `INSERT INTO users (email, password) VALUES ('${user.email}', '${user.password}')`);
        db.query(`INSERT INTO users (email, password) VALUES ('${user.email}', '${user.password}')`, function (err, res) {
          if(err){
            console.log('error', err);
            next(err, null);
          } else {
            next(null, res.insertId);
          }
        });
      })
      .catch(error => { next(error, null) });
  };

  User.login = (req, res, next) => {
    db.query(`SELECT * FROM users WHERE email = '${req.body.email}'`, function (err, res) {
      console.log("err db", err);
;      if (err) {
        next(err, null);
      } else {
        if (res.length > 1) {
          bcrypt.compare(req.body.password, res[0].password)
          .then( valid => {
            console.log("valid", valid);
            if (!valid) {
              return next(err, null);
            } else {
              console.log("res", res);
              next(null, {
                userId: res[0].id,
                token: 'TOKEN'
              })
            }
          })
          .catch( error => { next(error, null) } )
        } else {
          next(err, null);
        }
      }
    });
  }

// User.createUser = function (pseudo, mdp, avatar, role, result) {
//     db.query('INSERT INTO users set ?', { pseudo, mdp, avatar, role }, function (err, res) {
//         if(err){
//             console.log('error', err);
//             result(err, null);
//         } else {
//             result(null, res.insertId);
//         }
//     });
// };

// User.getAllUser = function (result) {
//     console.log("icic lala");
//     db.query('SELECT * FROM users', function (err, res){
//         if(err){
//             console.log('error', err);
//             result(err,null);
//         } else {
//             result(null, res);
//         }
//     });
// }

// User.getUserByPseudo = function (pseudo, result) {
//     db.query(`SELECT * FROM users WHERE pseudo = '${pseudo}'`, function (err, res){
//         if(err){
//             console.log('error', err);
//             result(err,null);
//         } else {
//             result(null, res);
//         }
//     });
// }

// User.logUser = function (userPseudo, userMdp, result){
//     db.query(`SELECT * FROM users WHERE pseudo = '${userPseudo}' AND mdp = '${userMdp}'`, function (err, res){
//         if(err) {
//             console.log('error', err);
//             result(err, null) 
//         } else {
//             result(null, res)
//         }
//     });
// }

module.exports = User;