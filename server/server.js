const app = require('./src/app');
const db = require('./src/models/DBInterface');

db.connectDatabase();


app.listen(3000, () => {
    console.log(`The server is running...`);
})






