const Sequelize = require('sequelize');
const config = require('../config/serverConfig').dbConnectConfig;

const sequelize = new Sequelize(config.database, config.user, config.password, {
    host: config.host,
    dialect: 'mysql'
}) 


module.exports = class DBInterface{
    static connectDatabase(){
        sequelize.authenticate()
        .then(() => {
            console.log('Connect database successfully');
        })    
        .catch(err => {
            console.error('Connect database failed: ', err);
        })
    }
    
    static getSequelizeInstance(){
        return sequelize;
    }
}