var db = require('../db');
const bcrypt = require('bcrypt');

var User = function (user) {
    this.email = user.email;
    this.password = user.password;
}

User.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = {
          email: req.body.email,
          password: hash
        };
        db.query(`INSERT INTO users (email, password) VALUES ('${user.email}', '${user.password}')`, function (err, res) {
          if(err){
            next(err, null);
          } else {
            next(null, res.insertId);
          }
        });
      })
      .catch(error => res.status(500).json({ error: 'something failed in brcypt' }));
  };

  User.login = (req, res, next) => {
    db.query(`SELECT * FROM users WHERE email = ${req.body.email}`, function (err, user) {
      if (err) {
        next(err, null);
      } else {
        bcrypt.compare(req.body.password, user.password)
          .then( valid => {
            if (!valid) {
              return next(err, null);
            } else {
              next(null, {
                userId: user.id,
                token: 'TOKEN'
              })
            }
          })
          .catch( error => { next(error, null) } )
      }
    })
    // User.findOne({ email: req.body.email })
    //   .then(user => {
    //     if (!user) {
    //       return res.status(401).json({ error: 'Utilisateur non trouvé !' });
    //     }
    //     bcrypt.compare(req.body.password, user.password)
    //       .then(valid => {
    //         if (!valid) {
    //           return res.status(401).json({ error: 'Mot de passe incorrect !' });
    //         }
    //         res.status(200).json({
    //           userId: user._id,
    //           token: 'TOKEN'
    //         });
    //       })
    //       .catch(error => res.status(500).json({ error }));
    //   })
    //   .catch(error => res.status(500).json({ error }));
  };

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