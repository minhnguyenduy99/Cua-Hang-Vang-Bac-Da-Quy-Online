const DBInterface = require('./DBInterface');
const sequelize = require('sequelize');
const uuid = require('uuid');
const sqlInstance = DBInterface.getSequelizeInstance();

class LoaiNhanVien extends sequelize.Model{
    static initModel(){
        LoaiNhanVien.init({
            ID_LNV: {
                type: sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true, 
            },
            TenLNV: {
                type: sequelize.STRING(20),
                allowNull: false,
                unique: true,
                set(val){
                    if (val)
                        this.setDataValue('TenLNV', val.toUpperCase());
                }
            }
        }, {
            tableName: 'LoaiNhanVien',
            timestamps: false,
            sequelize: sqlInstance
        })
    }
}

module.exports = LoaiNhanVien;