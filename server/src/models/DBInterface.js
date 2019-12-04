const Sequelize                   = require('sequelize');
const config                      = require('../config/serverConfig');


const { DB_CONNECTION_LIST } = config;

function getDBConnection(name){
    try{
        let dbConfig = DB_CONNECTION_LIST.find((config) => config.name.toLowerCase() === name.toLowerCase());
        if (!dbConfig) {
            console.log(`[DatabaseNameError] Cannot find configuration named: ${name}`);
            return null;
        }
        
        return {
            name: name,
            sequelize: new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
                host: dbConfig.host,
                dialect: 'mysql',
                logging: false
            })
        } 
    }
    catch(err){
        console.log(err);
    }
}

const defaultConfigOption = {
    mode  : 'TEST',         //  
    sync  : {
        models  : null,
        tableID : false,
    }
}

// singleton pattern
module.exports = class DBInterface{

    constructor(configOption){
        this.configOption = configOption || defaultConfigOption;

        const { mode, sync } = this.configOption;

        if (sync.models === 'all')      sync.syncTableID = true;
        else if (sync.models === null)  sync.syncTableID = false;
        else                            sync.syncTableID = sync.models;

        this.connection = getDBConnection(mode);

        if (!this.connection){
            throw new Error('Connection mode does not exist');
        }
    }

    async connectToDatabase(){
        const {sequelize, name} = this.connection;
        return sequelize.authenticate()
        .then(() => {
            console.log(`[${name}] Connect database successfully`);
        })    
        .catch(err => {
            console.error('[DBConnectionFailed] Connect database failed');
            throw err;
        })
    }
    
    async migrate(){
        const DBMigrator   = require('./MigrateDB');
        const { sync: { models, tableID } } = this.configOption;
        const { name } = this.connection;

        await DBMigrator.migrateTableID(tableID)
        await DBMigrator.initAndAssociateAll()
        console.log(`[${name}] Init and associate database successfully`);
        
        if (!models)
            return;
        if (models === 'all') await DBMigrator.syncAll();
        else                  await DBMigrator.sync(models);
        console.log(`[${name}] Sync database successfully`);
    }

    async close(){
        const {sequelize} = this.connection;
        await sequelize.connectionManager.close().then(() => {
            console.log('[DBConnection] Close connection ...');
        })
    }

    static get(configOption = null){
        if (configOption){
            this.instance = new DBInterface(configOption);
            return this.instance;
        }

        if (!this.instance){
            throw new Error('The config options must be specified');
        }

        return this.instance;
    }
    
    static getSequelizeInstance(){
        return DBInterface.get().connection.sequelize;
    }
}