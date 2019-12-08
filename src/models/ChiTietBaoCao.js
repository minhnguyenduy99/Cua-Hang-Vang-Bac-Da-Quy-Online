const sequelize         = require('sequelize');
const sqlInstance       = require('./DBInterface').getSequelizeInstance();
const BaseModel         = require('./BaseModel');
const Phieu             = require('./Phieu');
const BaoCao            = require('./BaoCao');


class ChiTietBaoCao extends BaseModel{

    static async initModel(){

        ChiTietBaoCao.init({
            idphieu: {
                type: sequelize.STRING(Phieu.getModelIDLength()),
            },
            idbc: {
                type: sequelize.STRING(BaoCao.getModelIDLength())
            }
        }, {
            sequelize: sqlInstance,
            timestamps: false,
            tableName: 'ChiTietBaoCao',
            hooks: {
                beforeCreate(chitiet, options){
                    
                }
            }
        })
    }

    static async setAssociations(){
        const Phieu   = require('./Phieu');

        ChiTietBaoCao.Phieu = ChiTietBaoCao.belongsTo(Phieu, {
            as: 'phieu',
            foreignKey: 'idphieu'
        })
    }
}

module.exports = ChiTietBaoCao;