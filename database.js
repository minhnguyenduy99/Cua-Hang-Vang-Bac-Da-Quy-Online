module.exports = async function(){
    const args = require('./server-run-arguments')();
    
    const dbConfigOption = {
        mode  : args.db,
        sync: {
            models: args.sync,
            tableID: args.tableID
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
        console.log(`[ConnectFailed] Cannot connect database ${args.db}`);
        return false;
    }
};