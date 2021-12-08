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
        // db.query(`INSERT INTO users (email, password) VALUES (${user.email}, ${user.password})`)
        //     .then(() => {
        //         console.log("ici 1");
        //         res.status(201).json({ message: 'Utilisateur créé !' })
        //     })
        //     .catch( error => {
        //         console.log("ici 2");
        //         res.status(400).json({ error: 'something failed 1' })
        //     })
        db.query(`INSERT INTO users (email, password) VALUES ('${user.email}', '${user.password}')`, function (err, res) {
          if(err){
            console.log('error', err);
            next(err, null);
          } else {
            next(null, res.insertId);
          }
        });
        // user.save()
        //   .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        //   .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error: 'something failed 2' }));
  };

  User.login = (req, res, next) => {
    db.query(`SELECT * FROM users WHERE email = '${req.body.email}'`, function (err, user) {
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