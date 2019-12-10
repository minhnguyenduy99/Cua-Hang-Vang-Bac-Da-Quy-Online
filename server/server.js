async function runServer(){
    const { hostIP } = require('./src/config/serverConfig');
    const ip = hostIP  || '127.0.0.1';
    const db = require('./database');
    const success = await db();
    if (!success){
        console.log('[Server] Close server ...');
        return;
    }

    const acl = require('./src/config/access-control');
    const app = require('./src/app');
    
    // initialize access control list for server resources
    await acl.init();

    try{
        app.listen(3000, ip, () => {
            console.log(`The server is running...`);
        })
    }
    catch(err){
        console.log(err.message);
    }
}

runServer();










