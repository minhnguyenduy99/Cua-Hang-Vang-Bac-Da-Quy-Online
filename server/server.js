async function runServer(){
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

    app.listen(3000, () => {
        console.log(`The server is running...`);
    })
}

runServer();










