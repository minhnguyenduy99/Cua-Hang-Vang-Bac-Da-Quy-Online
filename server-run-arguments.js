const minimist = require('minimist');

function parseArgs(){
    let args = minimist(process.argv.slice(2), {
        alias: {
            db_connection_name: 'db'
        },
        default: {
            //  The run mode of server. Include: TEST, DEVLOPMENT
            mode                : "DEBUG",

            hostIP              : "localhost",

            //  The database connection name specified in serverConfig.js
            db                  : "LOCAL",          

            // The sync option. Could be:
            //  'all'
            //  An array of model to be sync,
            //  null (not sync)
            sync                : null,

            // Sync TableIDs table
            tableID             : false
        }
    })
    return args;
}

module.exports = parseArgs;
