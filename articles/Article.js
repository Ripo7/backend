var db = require('../db');

var Article = function (article) {
    this.userPseudo = article.userPseudo;
    this.text = article.text
}

Article.createArticle = function (userId, text, result) {
    db.query('INSERT INTO articles set ?', { userId, text }, function (err, res) {
        if(err){
            console.log('error', err);
            result(err, null);
        } else {
            result(null, res.insertId);
        }
    });
};

Article.getAllArticle = function (result) {
    db.query('SELECT * FROM `articles` art INNER JOIN `users` u ON art.userId = u.userId', function (err, res){
        if(err){
            console.log('error', err);
            result(err,null);
        } else {
            result(null, res);
        }
    });
}

module.exports = Article;