const sequelize = require('sequelize');
const uuid = require('uuid');
const path = require('path');
const dbInterface = require('./DBInterface');
const sqlInstance = dbInterface.getSequelizeInstance();
const Model = sequelize.Model;

const Account = require('./Account');

class KhachHang extends Model{

    delete(){
        const account_id = this.ACCOUNT_ID; 
        const imageFile = this.AnhDaiDien;
        // Khách hàng không có account
        return new Promise((resolve, reject) => {
            KhachHang.destroy({
                where: {ID_KH: this.ID_KH}
            })
            .then(number => {
                const success = number == 1;
                // delete successfully
                if (number == 1){
                    const filePath = path.join(
                        require('../config/serverConfig').publicFolderPath,
                        'images/khachhang',
                        imageFile);
                    require('fs').unlink(filePath, err => {
                        console.log(err);
                    })
                }
                resolve(success);
            })
            .catch(err => reject(err));
        })
    }
}

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
        unique: true,
        validate: {
            is: /^[0-9]*$/
        },
    },
    NgaySinh: {
        type: sequelize.DATEONLY,
        allowNull: true,
        validate: {
            greaterThan18YearsOld(value){
                const age = new Date().getFullYear() - value.getFullYear();
                if (age < 18){
                    throw new Error('Phải từ 18 tuổi trở lên');
                }
            },
            isYearNegative(value){
                const year = value.getFullYear();
                if (year <= 0){
                    throw new Error('Gía trị năm không hợp lệ');
                }
            }  
        },
        set(value){
            const castValue = new String(value);
            // Input is a string
            if (castValue instanceof String){
                const dateSplit = castValue.split('/');
                const dateCast = new Date(dateSplit[2], dateSplit[1] - 1, dateSplit[0]);
                this.setDataValue('NgaySinh', dateCast);
            }
            else{
                this.setDataValue('NgaySinh', value);
            }
        }
    },
    GioiTinh: {
        type: sequelize.STRING(8),
        set: (value) => {
            this.setDataValue('GioiTinh', value.toUpperCase());
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
    ACCOUNT_ID: {
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