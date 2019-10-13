const conn = require('./src/dbConnection');

const app = require('./src/app');
const config = require('./config');
const mysql = require('mysql');

conn.connect(err => {
    if (err) {
        console.log('Connect to database failed')
    }
    else{
        console.log('Connect to database successfully')
    }
})

app.listen(3000, () => {
    console.log(`The server is running...`);
})






