const app = require('./src/app');
const db = require('./src/models/DBInterface');
const migrateDB = require('./src/models/MigrateDB');

db.connectDatabase();
migrateDB.migrate('SanPham');


app.listen(3000, () => {
    console.log(`The server is running...`);
})






