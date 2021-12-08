var express = require('express');

var router = express.Router();

var bodyParser = require('body-parser');

router.use(bodyParser.json());

var Article = require('./Article')

router.get('/all', function (req, res){
    Article.getAllArticle(function (err, article) {
        if(err) {
            return res.status(500).send({ error: 'Something failed' });
        } else {
            return res.status(200).send(article);
        }
    });
}); 

router.post('/', function(req, res) {
    var userId = req.body.userId;
    var text = req.body.text;
    Article.createArticle(userId, text, function (err, article) {
        if(err) {
            return res.status(500).send({ error: 'Something failed' });
        } else {
            return res.json(article);
        }
    });
});

module.exports = router;