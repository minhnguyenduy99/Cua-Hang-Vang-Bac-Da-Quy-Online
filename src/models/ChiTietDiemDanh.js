const sequelize     = require('sequelize');
const sqlInstance   = require('./DBInterface').getSequelizeInstance();
const BaseModel     = require('./BaseModel');
const appConfig     = require('../config/application-config');
const DateHelper    = require('../helpers/date-helper');
const ErrorHandler  = require('../middlewares/error-handler').ErrorHandler;

const dataValidator = appConfig.dataValidator;


class ChiTietDiemDanh extends BaseModel{

    static async initModel(){
        ChiTietDiemDanh.init({
            idnv: {
                type: sequelize.UUID,
                primaryKey: true,
                field: 'IDNV'
            },
            ngay: {
                type: sequelize.INTEGER,
                primaryKey: true,
                field: 'Ngay'
            },
            thang: {
                type: sequelize.INTEGER,
                primaryKey: true,
                field: 'Thang',
                validate: {
                    min: dataValidator.Thang.args[0],
                    max: dataValidator.Thang.args[1]
                }
            },
            nam: {
                type: sequelize.INTEGER,
                primaryKey: true,
                field: 'Nam',
                validate: {
                    max: dataValidator.Nam_Max
                }
            },
            dilam: {
                type: sequelize.BOOLEAN,
                allowNull: false,
                field: 'DiLam'
            }
        }, {
            tableName: 'ChiTietDiemDanh',
            sequelize: sqlInstance,
            timestamps: false,
            validate: {
                isNgayValid(){
                    if (!DateHelper.isDateValid(this.ngay, this.thang, this.nam))
                        throw ErrorHandler.createError('invalid_value', { fields: ['ngay', 'thang', 'nam'] })
                }
            }
        })
    }

    static async setAssociations(){
        const NhanVien  = require('./NhanVien');
        
        ChiTietDiemDanh.nhanvien = ChiTietDiemDanh.belongsTo(NhanVien, {
            as: 'nhanvien',
            foreignKey: 'idnv'
        })
    }

    static async defineScopes(){
        ChiTietDiemDanh.addScope('byThang', (thang, nam) => {
            return {
                where: {thang: thang, nam: nam},
                attributes: {
                    include: [
                        'idnv',
                        [sequelize.literal('COUNT(if(dilam=0, 1, null))'), 'songayvang'],
                    ]
                },
                group: ['idnv'],
            }
        })

        ChiTietDiemDanh.addScope('withNhanVien', {
            include: [
                { 
                    association: ChiTietDiemDanh.nhanvien, 
                    attributes: ['idnv', 'luongcoban']
                }
            ]
        })

        ChiTietDiemDanh.addScope('raw', {
            raw: true
        })
    }

    static async getDiemDanhTheoThang(idnv, thang, nam){
        const result = await ChiTietDiemDanh
            .scope({ method: ['byThang', thang, nam] }, 'withNhanVien')
            .findOne({
                where: { idnv: idnv }
            });
        
        return result;
    }

    static async getAllDiemDanhTheoThang(thang, nam){
        const result = await ChiTietDiemDanh
            .scope({ method: ['byThang', thang, nam] }, 'withNhanVien')
            .findAll();
        
        return result;
    }

    static async createListDiemDanh(listNhanVienID_DiLam, ngay, thang, nam){
        const listDiemDanh = listNhanVienID_DiLam.map(id_dilam => {
            return {
                idnv    : id_dilam.idnv,
                dilam   : id_dilam.dilam,
                ngay    : ngay,
                thang   : thang,
                nam     : nam
            }
        })

        let listChiTiet = (await ChiTietDiemDanh.bulkCreate(listDiemDanh, {
            updateOnDuplicate: ['idnv', 'dilam', 'ngay', 'thang', 'nam']
        }))
            .map(chitiet => chitiet.get({ plain: true }));

        return listChiTiet;
    }
}


module.exports = ChiTietDiemDanh;