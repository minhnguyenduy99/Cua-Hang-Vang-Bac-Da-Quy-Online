const DBInterface = require('./DBInterface');
const sequelize = require('sequelize');
const uuid = require('uuid');
const data_validator = require('../config/application-config').dataValidator;
const op = sequelize.Op;
const sqlInstance = DBInterface.getSequelizeInstance();
const path = require('path');

const LoaiNhanVien = require('./LoaiNhanVien');
const Account = require('./Account');
const HoaDon = require('./HoaDon');

class NhanVien extends sequelize.Model{
    static initModel(){
        NhanVien.init({
            ID_NV: {
                type: sequelize.UUID,
                primaryKey: true,
                defaultValue: () => {
                    return uuid();
                } 
            },
            HoTen: {
                type: sequelize.STRING(50),
                allowNull: false,
            },
            NgaySinh: {
                type: sequelize.DATEONLY,
                allowNull: false,
                validate: {
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
            CMND: {
                type: sequelize.STRING(15),
                validate: {
                    is: data_validator.CMND
                }
            },
            SDT: {
                type: sequelize.STRING,
                validate: {
                    is: data_validator.SDT
                }
            },
            DiaChi: {
                type: sequelize.TEXT,
                allowNull: true,
            },
            AnhDaiDien: {
                type: sequelize.TEXT,
                allowNull: true
            },
            NgayVaoLam: {
                type: sequelize.DATEONLY,
                allowNull: true,
                defaultValue: () => Date(),
                validate: {
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
                        this.setDataValue('NgayVaoLam', dateCast);
                    }
                    else{
                        this.setDataValue('NgayVaoLam', value);
                    }
                }
            },
        }, {
            tableName: 'NhanVien',
            timestamps: false,
            sequelize: sqlInstance
        })
    }

    static async findNhanVienByID(id){
        return NhanVien.findOne({
            where: { ID_NV: id }
        })
        .then(nhanVien => {
            return Promise.resolve(nhanVien);
        })
        .catch(err => {
            return Promise.reject(err);
        })
    }
    delete(){
        const account_id = this.ACCOUNT_ID; 
        const imageFile = this.AnhDaiDien;
        // Khách hàng không có account
        return new Promise((resolve, reject) => {
            NhanVien.destroy({
                where: {ID_NV: this.ID_NV}
            })
            .then(number => {
                const success = number == 1;
                // delete successfully
                if (number == 1){
                    const filePath = path.join(
                        require('../config/serverConfig').publicFolderPath,
                        'images/nhanvien',
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

module.exports = NhanVien;