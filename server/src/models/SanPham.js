const path = require('path');
const fs = require('fs');
const uuid = require('uuid');
const validator = require('../helpers/data-validator');
const sequelize = require('sequelize');
const Model = sequelize.Model;
const sqlInstance = require('./DBInterface').getSequelizeInstance();


class SanPham extends Model{
    static fullTextSearch(text){
        return sqlInstance.query('SELECT * FROM users WHERE MATCH(Ten) AGAINST (\'?\' IN NATURAL LANGUAGE MODE)', {
            replacements: [text],
            type: sequelize.QueryTypes.SELECT,
            plain: false,
        })
    }

    delete(){
        const imageFile = this.AnhDaiDien;
        return SanPham.destroy({
            where: {IDSanPham: this.IDSanPham}
        })
        .then(number => {
            if (number > 0){
                // delete image
                const filePath = path.join(
                    require('../config/serverConfig').publicFolderPath,
                    'images/sanpham',
                    imageFile);
                fs.unlink(filePath, err => {
                    if (err){
                        return Promise.reject('Cannot delete the image file');
                    }
                })                
            }
            return Promise.resolve(number);
        })
    }
}

SanPham.init({
    IDSanPham: {
        type: sequelize.UUID,
        primaryKey: true,
        defaultValue: function(){
            return uuid();
        }
    },
    Ten: {
        type: sequelize.STRING,
        allowNull: false,
    },
    SoLuong: {
        type: sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            is: /^[0-9]*$/
        }
    },
    GiaNhap: {
        type: sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            is: /^[0-9]*00$/,
            is200Odd(value){
                if (value % 200 != 0){
                    throw new Error('The price must be a division of 200');
                }
            }
        }
    },
    GiaBan: {
        type: sequelize.INTEGER,
        allowNull: false,
        validate: {
            is: /^[0-9]*00$/,
            is200Odd(value){
                if (value % 200 != 0){
                    throw new Error('The price must be a division of 200');
                }
            }
        }
    },
    GiaCam: {
        type: sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            is: /^[0-9]*00$/,
            is200Odd(value){
                if (value % 200 != 0){
                    throw new Error('The price must be a division of 200');
                }
            }
        }
    },
    GiaGiaCong: {
        type: sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            is: /^[0-9]*00$/,
            is200Odd(value){
                if (value % 200 != 0){
                    throw new Error('The price must be a division of 200');
                }
            }
        }
    },
    AnhDaiDien: {
        type: sequelize.STRING,
        defaultValue: '',
    },
    TieuChuan: {
        type: sequelize.STRING,
        allowNull: true,
    },
    KhoiLuong: {
        type: sequelize.FLOAT,
        allowNull: false,
        validate: {
            is: /^[0-9]*.?[0-9]{0,2}$/
        }
    },
    GhiChu: {
        type: sequelize.TEXT,
        allowNull: true,
    }
},
{
    modelName: 'SanPham',
    sequelize: sqlInstance,
    timestamps: false,
    indexes: [
        {
            fields: ['Ten'],
            type: 'FULLTEXT'
        }
    ]
})



module.exports = SanPham;