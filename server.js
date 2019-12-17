async function runServer(){
    let { mode, hostIP, ...otherOption } = require('./server-run-arguments')();

    printServerInfo(mode, hostIP, otherOption);

    const db = require('./database');
    const success = await db(otherOption);
    if (!success){
        console.log('[Server] Close server ...');
        return;
    }

    const acl = require('./src/config/access-control');
    const app = require('./src/app');
    
    // initialize access control list for server resources
    await acl.init();

    try{
        app.listen(3000, hostIP, () => {
            console.log(`[${mode}] The server is running at ${hostIP}:3000 ...`);
        })
    }
    catch(err){
        console.log(err.message);
    }
}

function printServerInfo(mode, hostIP, dbConfig){
    console.log(`SERVER_MODE: ${mode}`);
    console.log(`SERVER_ADDRESS: ${hostIP}`);
    console.log(`DATABASE_CONFIGURATION:`);
    console.log(dbConfig);
}

runServer();










