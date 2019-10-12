const DBConnection = require('./src/dbConnection');
const app = require('./src/app');
const config = require('./config');



const db = new DBConnection(config.dbConnectConfig);
db.connect();

app.listen(3000, () => {
    console.log(`The server is running...`);
})






