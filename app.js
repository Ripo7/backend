var express = require('express');
var app = express();

var UserController = require('./users/UserController');
var ArticleController = require('./articles/ArticleController.js')

app.use('/users', UserController);
app.use('/articles', ArticleController);

module.exports = app;