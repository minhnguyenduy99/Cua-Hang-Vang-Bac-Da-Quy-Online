const sequelize = require('sequelize');
const uuid = require('uuid');
const dbInterface = require('./DBInterface');
const sqlInstance = dbInterface.getSequelizeInstance();
const Model = sequelize.Model;

class KhachHang extends Model{}

KhachHang.init({
    ID_KH: {
        primaryKey: true,
        type: sequelize.UUID,
        defaultValue: () => {
            return uuid();
        }
    },
    TenKH: {
        type: sequelize.STRING(30),
        allowNull: false,
    },
    CMND: {
        type: sequelize.STRING(13),
        allowNull: false,
        validate: {
            is: /^[0-9]*$/
        },
    },
    NgaySinh: {
        type: sequelize.DATEONLY,
        allowNull: true,
    },
    GioiTinh: {
        type: sequelize.STRING(8),
        set: (value) => {
            return value.toUpperCase();
        },
        validate: {
            isIn: ['NAM', 'NU', 'KHONGRO']
        }
    },
    SDT: {
        type: sequelize.STRING(11),
        allowNull: false,
        validate: {
            is: /^[0-9]{10,11}$/
        }
    },
    DiaChi: {
        type: sequelize.TEXT,
        allowNull: true,
    },
    AnhDaiDien: {
        type: sequelize.STRING,
        allowNull: false
    },
    Account_ID: {
        type: sequelize.UUID,
        references: {
            model: require('./Account'),
            key: 'id',
        },
        allowNull: true,
    }
},{
    tableName: 'KhachHang',
    timestamps: false,
    sequelize: sqlInstance
})


module.exports = KhachHang;