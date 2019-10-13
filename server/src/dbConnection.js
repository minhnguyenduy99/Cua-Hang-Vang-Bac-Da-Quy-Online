const mysql = require('mysql');
const config = require('../config');

var conn = mysql.createConnection(config.dbConnectConfig);
var connected = true;
module.exports = {
    connect: function(callback){
        conn.connect(callback);
    },
    connection: conn,
}