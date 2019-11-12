const DBInterface = require('./DBInterface');
const sequelize = require('sequelize');
const uuid = require('uuid');
const instance = DBInterface.getSequelizeInstance();

const SanPham = require('./SanPham');
const HoaDon = require('./HoaDon');

class ChiTietHoaDon extends sequelize.Model{
    static initModel(){
        ChiTietHoaDon.init({
            SoLuong: {
                type: sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
                validate: {
                    is: /^[0-9]*$/,
                    isInt: true
                }
            }
        }, {
            tableName: 'ChiTietHoaDon',
            timestamps: false,
            sequelize: instance,
        })
    }
}

module.exports = ChiTietHoaDon;