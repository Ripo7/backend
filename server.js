var app = require('./app');

var port = process.env.port || 3000;

var server = app.listen(3000, function (){
    console.log('Express server listening on port ' + 3000);
    const all_routes = require('express-list-endpoints');
    console.log(all_routes(app));
})