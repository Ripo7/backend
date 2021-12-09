var db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

var User = function (user) {
    this.pseudo = user.pseudo;
    this.password = user.password;
}

User.signup = (req, res, next) => {
   // Cryptage du MDP
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        // Création du user a stocké
        const user = {
          email: req.body.email,
          pseudo: req.body.pseudo,
          password: hash
        };
        // Inserttion dans la base et retourne l'insert ID
        db.query(`INSERT INTO users (email, pseudo, password) VALUES ('${user.email}', '${user.pseudo}', '${user.password}')`, function (err, res) {
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
    // Check si email existe
    db.query(`SELECT * FROM users WHERE email = '${req.body.email}'`, function (err, res) {
      console.log("err db", err);
      if (err) {
        next(err, null);
      } else {
        if (res.length >= 1) {
          // Compare mdp krypté
          bcrypt.compare(req.body.password, res[0].password)
          .then( valid => {
            console.log("valid", valid);
            if (!valid) {
              // If not valid error
              return next(err, null);
            } else {
              // if valid return user and token
              next(null, {
                userId: res[0].id,
                token: jwt.sign(
                  { userId: res[0].id },
                  'RANDOM_TOKEN_SECRET',
                  { expiresIn: '24h' }
                )
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

  User.getUser = (req, res, next) => {
    console.log("req get user", req);
    db.query(`SELECT pseudo, id FROM users WHERE users.id = '${req.params.idUser}'`, function (err, res) {
      if (err) {
        next(err, null);
      } else {
        if (res.length >= 1) {
          next(null, res);
        } else {
          next(err, null);
        }
      }
    })
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