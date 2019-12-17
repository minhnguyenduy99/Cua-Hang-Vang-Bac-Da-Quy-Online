module.exports = async function(argsOption){
    
    const dbConfigOption = {
        mode  : argsOption.db,
        sync: {
            models: argsOption.sync,
            tableID: argsOption.tableID
        },
    }

    const db = require('./src/models/DBInterface');
    let dbInterface = null;
    try{
        dbInterface = db.get(dbConfigOption);
        await dbInterface.connectToDatabase().then(() => {
            dbInterface.migrate();
        });
        return true;
    }
    catch(err){
        if (dbInterface)
            dbInterface.close();
        console.log(`[ConnectFailed] Cannot connect database ${dbConfigOption.mode}`);
        console.log(`[ConnectFailed] ${err.message}`);
        return false;
    }
};