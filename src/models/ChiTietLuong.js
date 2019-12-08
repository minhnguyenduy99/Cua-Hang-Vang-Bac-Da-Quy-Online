const sequelize         = require('sequelize');
const NhanVien          = require('./NhanVien');
const BaseModel         = require('./BaseModel');
const sqlInstance       = require('./DBInterface').getSequelizeInstance();
const appValidator      = require('../config/application-config');
const ChiTietDiemDanh   = require('./ChiTietDiemDanh');
const DateHelper        = require('../helpers/date-helper');

const dataValidator     = appValidator.dataValidator;


class ChiTietLuong extends BaseModel{

    static async initModel(){
        ChiTietLuong.init({
            idnv: {
                type: sequelize.UUID,
                primaryKey: true,
                field: 'IDNV'
            },
            thang: {
                type: sequelize.INTEGER,
                primaryKey: true,
                field: 'Thang',
                validate: {
                    isNumeric: true,
                    min: {
                        args: [dataValidator.Thang.args[0]],
                        msg:  dataValidator.Thang.msg
                    },
                    max: {
                        args: [dataValidator.Thang.args[1]],
                        msg:  dataValidator.Thang.msg
                    }
                }
            },
            nam: {
                type: sequelize.INTEGER,
                primaryKey: true,
                field: 'Nam',
                validate: {
                    isInt: true,
                    max: {
                        args: [dataValidator.Nam_Max.args],
                        msg: dataValidator.Nam_Max.msg
                    }
                }
            },
            luong: {
                type: sequelize.INTEGER.UNSIGNED,
                validate: {
                    is: dataValidator.TienTe,
                },
                field: 'Luong',
                set(value){
                    const intVal = Math.round(value);
                    this.setDataValue('luong', intVal - intVal % 500);
                }
            },
            tienphat: {
                type: sequelize.INTEGER.UNSIGNED,
                validate: {
                    is: dataValidator.TienTe,
                },
                defaultValue: 0,
                field: 'TienPhat',
            }
        }, {
            sequelize: sqlInstance,
            timestamps: false,
            tableName: 'ChiTietLuong',
            hooks: {
                beforeCreate(chitietluong, options){
                    const {idnv, thang, nam} = chitietluong.getDataValue();
                    return new Promise(async (resolve, reject) => {
                        try{
                            const {songayvang} = await ChiTietDiemDanh.getDiemDanhTheoThang(
                                idnv, thang, nam
                            )
                            const tongsongay = DateHelper.getNumberOfDays(thang, nam);
                            chitietluong.updateLuong(songaylam, tongsongay);
                            resolve();
                        }
                        catch(err){
                            reject(err);
                        }
                    })
                },
            }
        })
    }

    static async defineScopes(){
        ChiTietLuong.addScope('withChiTietDiemDanh', (thang, nam) => {
            return {
                where: {thang: thang, nam: nam},
                include: [
                    { 
                        association: ChiTietLuong.danhsach_ctdiemdanh, 
                        where: {thang: thang, nam: nam}
                    }
                ]
            }
        })

        ChiTietLuong.addScope('withAllCTDiemDanh', {
            include: [ { association: ChiTietLuong.danhsach_ctdiemdanh, } ] 
        })
    }

    static async setAssociations(){
        const ChiTietDiemDanh = require('./ChiTietDiemDanh');

        ChiTietLuong.danhsach_ctdiemdanh = ChiTietLuong.hasMany(ChiTietDiemDanh, {
            foreignKey: 'idnv',
        })
    }

    static async createAllChiTietLuong(listID_tienphat, thang, nam){
        const listCTDiemDanh = await ChiTietDiemDanh.getAllDiemDanhTheoThang(thang, nam);
        const countNgayTrongThang = DateHelper.getNumberOfDays(thang, nam);
        
        const listCTLuong = listCTDiemDanh.map(ctdiemdanh => {
            const {idnv, thang, nam, songayvang} = ctdiemdanh.get({ plain: true });
            const ctluong = {idnv, thang, nam, songayvang}; 
            ctluong.luongcoban = ctdiemdanh.nhanvien.luongcoban;

            return ctluong;
        })

        if (listID_tienphat){
            listID_tienphat.forEach(id_tienphat => {
                let ctluong = listCTLuong.find(ctluong => ctluong.idnv === id_tienphat.idnv);
                if (!ctluong) return;
                ctluong.tienphat = id_tienphat.tienphat;
            })
        }
        
        listCTLuong.forEach(ctluong => {
            const {luongcoban, songayvang, tienphat} = ctluong;
            ctluong.luong = ChiTietLuong.getLuong(luongcoban, songayvang, countNgayTrongThang, tienphat);
        })
        
        return ChiTietLuong.bulkCreate(listCTLuong);
    }

    static async getThongTinDiemDanh(idnv, thang, nam){
        return ChiTietLuong
            .scope({ method: ['withChiTietDiemDanh', thang, nam] })
            .findOne({ 
                where: { idnv: idnv } 
            })
    }

    static async getAllThongDiemDanhByThang(thang, nam){
        return ChiTietLuong
            .scope({ method: ['withChiTietDiemDanh', thang, nam] })
            .findAll();
    }

    async updateLuong(songayvang, tongsongay){
        const luongcoban = await NhanVien.findOne({
            attributes: ['luongcoban'],
            where: { idnv: chitietluong.idnv }
        })
        const luong = luongcoban * (tongsongay - songayvang) / tongsongay - this.tienphat;

        this.set('luong', luong);
    }  

    static getLuong(luongcoban, songayvang, tongsongay, tienphat = 0){
        const luong = luongcoban * (tongsongay - songayvang) / tongsongay - tienphat;
        
        return luong;
    }
}

module.exports = ChiTietLuong;