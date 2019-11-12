const Sequelize = require('sequelize');
const config = require('../config/serverConfig').dbConnectConfig;
const Model = Sequelize.Model;

const sequelize = new Sequelize(config.database, config.user, config.password, {
    host: config.host,
    dialect: 'mysql'
}) 

const DATABASE_ACTION_STATUS_CODE = {
    ERROR                    :   1000,
    VALIDATION_ERROR         :   1001,
    DUPLICATE_KEY_ERROR      :   1002,
    CONNECT_DB_FAILED        :   1003,
    ACTION_SUCCESS           :   2000,
    QUERY_SUCCESS_RESULT     :   2001,
    QUERY_SUCCESS_NO_RESULT  :   2002,
}

const STATUS_ALIAS = DATABASE_ACTION_STATUS_CODE;

module.exports = class DBInterface{
    
    static connectDatabase(){
        return new Promise((resolve, reject) => {
            sequelize.authenticate()
                .then(() => {
                    console.log('Connect database successfully');
                    resolve();
                })    
                .catch(err => {
                    console.error('Connect database failed: ', err)
                    reject(err);
                })
        })
    }

    static getStatusInfo(code){
        const info = {
            code: code
        }
        switch(code){
            case STATUS_ALIAS.CONNECT_DB_FAILED: info.msg = "Connect database failed"; break;
            case STATUS_ALIAS.DUPLICATE_KEY_ERROR: info.msg = "Duplicate key error"; break;
            case STATUS_ALIAS.ERROR: info.msg = "Action failed"; break;
            case STATUS_ALIAS.ACTION_SUCCESS: info.msg = "Action success"; break;
            case STATUS_ALIAS.QUERY_SUCCESS_RESULT: info.msg = "Query success - results returned";break;
            case STATUS_ALIAS.QUERY_SUCCESS_NO_RESULT: info.msg = "Query success - no result"; break;
        }

        return info;
    }
    
    static getSequelizeInstance(){
        return sequelize;
    }
}