var mysql = require('mysql');
var connection = mysql.createPool({
    host     : 'localhost',
    user     : 'sql_user',
    password : 'sqlpass',
    database : 'projet_1'
});
module.exports=connection;