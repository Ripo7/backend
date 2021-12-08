var mysql = require('mysql');
var connection = mysql.createPool({
    host     : 'localhost',
    user     : 'sql_user',
    password : '',
    database : 'projet_1'
});
module.exports=connection;