const path = require('path');
const fs = require('fs');
const uuid = require('uuid');
const validator = require('../helpers/data-validator');
const sequelize = require('sequelize');
const Model = sequelize.Model;
const sqlInstance = require('./DBInterface').getSequelizeInstance();

class LoaiSanPham extends Model{
    static initModel(){
        LoaiSanPham.init({
            ID_LSP: {
                type: sequelize.INTEGER,
                primaryKey: true,  
                autoIncrement: true
            },
            TenLSP: {
                type: sequelize.STRING(25),
                unique: true,
                set(value){
                    this.setDataValue('TenLSP', value.toUpperCase());
                }
            }
        },{
            tableName: 'LoaiSanPham',
            sequelize: sqlInstance,
            timestamps: false
        })
    }
}



module.exports = LoaiSanPham;

