var express = require('express');
var app = express();

const cors = require('cors');

const auth = require('./middleware/auth')

var UserController = require('./users/UserController');
var ArticleController = require('./articles/ArticleController.js')

app.use(cors({
    origin: '*'
}));
app.use('/users', UserController);
app.use('/articles', ArticleController);


module.exports = app;