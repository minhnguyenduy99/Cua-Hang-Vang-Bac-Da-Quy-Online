const sequelize             = require('sequelize');
const sqlInstance           = require('./DBInterface').getSequelizeInstance();
const BaseModel             = require('./BaseModel');
const DANH_SACH_LOAI_PHIEU  = require('../config/application-config').AppGlobalRule.DANH_SACH_LOAI_PHIEU

class LoaiPhieu extends BaseModel{
    static async initModel(){
        LoaiPhieu.init({
            idloaiphieu: {
                type: sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                field: 'IDLoaiPhieu'
            },
            tenloaiphieu: {
                type: sequelize.STRING(30),
                allowNull: false,
                unique: true,
                field: 'TenLoaiPhieu'
            }
        }, {
            tableName: 'LoaiPhieu',
            timestamps: false,
            sequelize: sqlInstance,
            hooks: {
                // insert sample data after syncing model
                afterSync(options){
                    LoaiPhieu.insertLoaiPhieu()
                    // .then(listLoaiPhieu => console.log(listLoaiPhieu))
                    .catch(err          => console.log(err));
                }
            },
        })
    }

    static async setAssociations(){
        const Phieu = require('./Phieu');
        
        LoaiPhieu.hasMany(Phieu, {
            as: 'danhsach_phieu',
            foreignKey: 'idloaiphieu'
        })

    }

    static insertLoaiPhieu(){
        const listLoaiPhieu = DANH_SACH_LOAI_PHIEU.map(tenLoaiPhieu => {return {tenloaiphieu: tenLoaiPhieu} });
        return LoaiPhieu.bulkCreate(listLoaiPhieu)
    }
}

module.exports = LoaiPhieu;