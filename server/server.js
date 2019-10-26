const app = require('./src/app');
const db = require('./src/models/DBInterface');
const migrateDB = require('./src/models/MigrateDB');

db.connectDatabase()
    .then(() => {
        // migrateDB.dropModels('SanPham', 'LoaiSanPham')
        // .then(() => {
        //     migrateDB.createModels('LoaiSanPham', 'SanPham')
        // })
    })
    .catch(err => console.log(err));

app.listen(3000, () => {
    console.log(`The server is running...`);
})






