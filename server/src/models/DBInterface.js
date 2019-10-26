const Sequelize = require('sequelize');
const config = require('../config/serverConfig').dbConnectConfig;

const sequelize = new Sequelize(config.database, config.user, config.password, {
    host: config.host,
    dialect: 'mysql'
}) 


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
    
    static getSequelizeInstance(){
        return sequelize;
    }
}