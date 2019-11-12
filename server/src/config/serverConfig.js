const path = require('path');

var serverConfig = {
    
    dbConnectConfig: {
        host: 'remotemysql.com',
        user: 'pKAX30MXzl',
        password: 'XlKkAmxDDu',
        database: 'pKAX30MXzl',
        port: 3306
    },

    publicFolderPath: path.resolve(__dirname, '../../public/'),

    storage: {
        images: {
            getPath: (modelName) => getImageStoragePath(modelName)
        }
    },

    TOKEN_PRIVATE_KEY: 'SECRET_KEY'
}

function getImageStoragePath(modelName){
    return path.join(serverConfig.publicFolderPath, 'images', modelName);
}

module.exports = serverConfig;