const path = require('path');

module.exports = {
    
    dbConnectConfig: {
        host: 'remotemysql.com',
        user: 'pKAX30MXzl',
        password: 'XlKkAmxDDu',
        database: 'pKAX30MXzl',
        port: 3306
    },

    publicFolderPath: path.resolve(__dirname, '../../public/'),

    TOKEN_PRIVATE_KEY: 'SECRET_KEY'
}