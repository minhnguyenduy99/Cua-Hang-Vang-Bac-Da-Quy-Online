const mysql = require('mysql');

class DBConnection{
    constructor(connectConfig){
        this.connectConfig = connectConfig;   
    }

    connect(){
        const connection = mysql.createConnection(this.connectConfig);
        connection.connect((err) => {
            if (err){
                console.log('Connect to database failed');
                db.end();
            }
            else{
                console.log('Connect to database successfully');
            }
        })
    }
}

module.exports = DBConnection;
