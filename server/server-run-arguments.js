const minimist = require('minimist');

function parseArgs(){
    let args = minimist(process.argv.slice(2), {
        alias: {
            db_connection_name: 'db'
        },
        default: {
            //  The run mode of server. Include: TEST, DEVLOPMENT
            mode                : "TEST",

            //  The database connection name specified in serverConfig.js
            db                  : "DEVELOPMENT",          

            // The sync option. Could be:
            //  'all'
            //  An array of model to be sync,
            //  null (not sync)
            sync                : null,

            // Sync TableIDs table
            tableID             : false
        }
    })
    console.log(args);
    return args;
}

module.exports = parseArgs;
