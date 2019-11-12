const app = require('./src/app');
const db = require('./src/models/DBInterface');
const dbmigrator = require('./src/models/MigrateDB');

db.connectDatabase()
.then(() => {
    dbmigrator.initAndAssociateAll()
    .then(() => {
        dbmigrator.removeFKChecks()
        .then(() => {
            console.log('Initialize models successfully');
                    dbmigrator.sync('HoaDon').then(() => {
                        dbmigrator.sync('ChiTietHoaDon').then(() => {
                            console.log('Sync model successfully');
                        })
                    })
        })
    })
    .catch(err => console.log(err));

    
    // dbmigrator.migrateAll()
    // .then(() => {
    //     console.log('Migrate database successfully');
    // })
    // .catch(err => console.log(err));
})
 

app.listen(3000, () => {
    console.log(`The server is running...`);
})






