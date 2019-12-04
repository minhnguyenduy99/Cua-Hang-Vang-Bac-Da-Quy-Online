const sequelize    = require('sequelize');
const sqlInstance  = require('./DBInterface').getSequelizeInstance();
const BaseModel    = require('./BaseModel');

class TableLastIDs extends BaseModel{

    static ZERO_PADDING_LIST(){
        return {
            SANPHAM : 4,
            PHIEU   : 4,
            DICHVU  : 3,
            BAOCAO  : 4,
        }
    };

    static async initModel(){
        TableLastIDs.init({
            SANPHAM: {
                type: sequelize.INTEGER.UNSIGNED,
                defaultValue: 0,
            },
            PHIEU: {
                type: sequelize.INTEGER.UNSIGNED,
                defaultValue: 0,
            },
            DICHVU: {
                type: sequelize.INTEGER.UNSIGNED,
                defaultValue: 0,
            },
            BAOCAO: {
                type: sequelize.INTEGER.UNSIGNED,
                default: 0
            }
        }, {
            tableName: 'TableLastIDs',
            sequelize: sqlInstance,
            timestamps: false,
            hooks: {
                afterSync(){
                    TableLastIDs.create({
                        SANPHAM: 0,
                        PHIEU: 0,
                        DICHVU: 0,
                        BAOCAO: 0
                    })
                    .catch(err => {
                        console.log(err);
                    })
                }
            }
        })
    }

    static async findIndex(modelName){
        const uppercaseModelName = modelName.toUpperCase();
        const lastIDIndex = await sqlInstance.query(
            `SELECT ${uppercaseModelName} FROM ${TableLastIDs.tableName}`,
            { type: sequelize.QueryTypes.SELECT })

        return lastIDIndex[0][uppercaseModelName];
    }

    static stringtifyID(modelName, prefix, index){
        const ucaseModelName = modelName.toUpperCase();
        return `${prefix.toUpperCase()}${index.toString().padStart(TableLastIDs.ZERO_PADDING_LIST()[ucaseModelName], '0')}`;
    }

    static async saveIndex(modelName, index){
        const uModelName = modelName.toUpperCase();
        return sqlInstance.query(
            `UPDATE ${TableLastIDs.tableName} SET ${uModelName} = ${index}`,
            { type: sequelize.QueryTypes.UPDATE }
        )
    }

    static async autoIncrementIndex(modelName){
        const uModelName = modelName.toUpperCase();
        await sqlInstance.query(
            `UPDATE ${TableLastIDs.tableName} SET ${uModelName} = ${uModelName} + 1`,
            { type: sequelize.QueryTypes.UPDATE }    
        )
        const modelIndex = await sqlInstance.query(
            `SELECT ${uModelName} FROM ${TableLastIDs.tableName} LIMIT 1`,
            { type: sequelize.QueryTypes.SELECT }
        )
        return modelIndex[0][uModelName];
    }

    static async autoIncrementID(model, prefix){
        try{
            const result = await TableLastIDs.autoIncrementIndex(model.name);
            
            model.lastIDIndex = result;
            const newID = this.stringtifyID(model.name, prefix, model.lastIDIndex);
            
            return newID;
        }
        catch(err){
            return Promise.reject(err);
        }
    }
}

module.exports = TableLastIDs;