const DBInterface           = require('./DBInterface');
const sequelize             = require('sequelize');
const uuid                  = require('uuid');
const appConfig             = require('../config/application-config');
const BaseModel             = require('./BaseModel');
const ImageManager          = require('./ImageManager').getInstance();
const ChiTietLuong          = require('./ChiTietLuong');
const ErrorHandler          = require('../middlewares/error-handler').ErrorHandler;

const data_validator        = appConfig.dataValidator;
const appGlobalValidator    = appConfig.AppGlobalRule;
const sqlInstance           = DBInterface.getSequelizeInstance();

class NhanVien extends BaseModel{
    static async initModel(){

        NhanVien.init({
            idnv: {
                type: sequelize.UUID,
                primaryKey: true,
                defaultValue: function(){
                    return uuid();
                },
                set(value){
                    let endValue = value;
                    if (!endValue){
                        endValue = uuid();
                    }
                    this.setDataValue('idnv', endValue);
                },  
                field: 'IDNV'
            },
            chucvu: {
                type: sequelize.INTEGER,
                allowNull: false,
                field: 'ChucVu',
                validate: {
                    isIn: [Object.values(appGlobalValidator.CHUC_VU)],
                },
            },
            idquanly: {
                type: sequelize.UUID,
                allowNull: true,
                defaultValue: null,
                validate: {
                    isQuanLy(value, done){
                        // nếu giá trị là null thì bỏ qua validation
                        if (!value){
                            done();
                            return;
                        }
                        NhanVien.findOne({ where: {idnv: value}})
                        .then(nhanvien => {
                            if      (!nhanvien) done(NhanVien.validationError(4));
                            else if (!nhanvien.isQuanLy()) 
                                done(NhanVien.validationError(6, 'không phải nhân viên quản lý'));
                            else
                                done();
                        })
                    }
                }
            },
            luongcoban: {
                type: sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
                validate: {
                    is: data_validator.TienTe
                },
                field: 'LuongCoBan',
                set(value){
                    this.setDataValue('luongcoban', parseInt(value.toString()))
                }
            },
        }, {
            tableName: 'NhanVien',
            timestamps: false,
            sequelize: sqlInstance,
            hooks: {
                afterSync(options){
                    ImageManager.deleteAllModelImages('NhanVien');
                },
            },
        })
    }

    static async setAssociations(){
        const Phieu             = require('./Phieu');
        const TaiKhoan          = require('./TaiKhoan');
        const ChiTietLuong      = require('./ChiTietLuong');  
        const ChiTietDiemDanh   = require('./ChiTietDiemDanh');
        
        NhanVien.hasOne(NhanVien, {
            as: 'quanly',
            foreignKey: {
                name: 'idquanly',
                allowNull: true
            },
        })

        NhanVien.danhsach_ctluong = NhanVien.hasMany(ChiTietLuong, {
            foreignKey: 'idnv',
            as: 'danhsach_ctluong'
        })

        NhanVien.hasMany(ChiTietDiemDanh, {
            as: 'danhsach_ctdiemdanh',
            foreignKey: 'idnv'   
        })

        NhanVien.hasMany(Phieu, {
            as: 'danhsach_phieu',
            foreignKey: {
                name: 'idnv',   
                allowNull: false
            }
        })

        NhanVien.TaiKhoan = NhanVien.belongsTo(TaiKhoan, {
            as: 'taikhoan',
            foreignKey: {
                name: 'idtk',
                allowNull: true
            }
        })
    }

    static async defineScopes(){
        NhanVien.addScope('withTaiKhoan', {
            include: [ { association: NhanVien.TaiKhoan }]
        })

        NhanVien.addScope('withTaiKhoanUpdate', {
            include: [{
                association: NhanVien.TaiKhoan,
                as: 'taikhoan',
                attributes: { exclude: [] }    
            }]
        })

        NhanVien.addScope('withAllChiTietLuong', {
            include: [
                { 
                    association: NhanVien.danhsach_ctluong,
                }
            ]
        })
    }

    isQuanLy(){
        const listChucVu = appGlobalValidator.CHUC_VU;
        return this.chucvu === listChucVu.QL_NHAN_SU    || 
               this.chucvu === listChucVu.GIAM_DOC      || 
               this.chucvu === listChucVu.QUAN_LY_KHO;
    }

    static findAllNhanVien(){
        return NhanVien.scope('withTaiKhoan').findAll();
    }

    static findNhanVienByID(id){
        return NhanVien.scope('withTaiKhoan').findOne({
            where: {idnv: id}
        })
    }

    static findNhanVienForUpdateByID(idnv){
        return NhanVien.scope('withTaiKhoanUpdate').findOne({
            where: {idnv: idnv}
        })
    }

    static register(taikhoan, nhanvien){
        if (!taikhoan.loaitk){
            taikhoan.loaitk = 'NHANVIEN';
        }
        nhanvien.taikhoan = {...taikhoan};
        
        return NhanVien.create(nhanvien)
        .then(newNhanVien => {
            newNhanVien.taikhoan.setDataValue('matkhau', '***');
            newNhanVien.taikhoan.setDataValue('salt', '***');
            return Promise.resolve(newNhanVien);
        })
        .catch(err => {
            throw err;
        })
    }

    getUpdatableFieldList(){
        return ['chucvu', 'idquanly', 'luongcoban'];
    }

    static async updateThongTin(idnv, updateObj){
        updateObj.modelname = 'nhanvien';      //      Chỉ đinh tên của model ứng với tài khoản

        const nhanvien = await this.findNhanVienForUpdateByID(idnv);
        if (!nhanvien){
            throw ErrorHandler.createError('rs_not_found', {fields: ['idnv']});
        }
        const taikhoan = nhanvien.taikhoan;

        const success = await sqlInstance.transaction(async (t) => {
            const result = await Promise.all([
                nhanvien.updateModel(updateObj, t),
                taikhoan.updateModel(updateObj, t)]);
            return result.reduce((pre, cur) => pre.success && cur.success)
        })

        return Object.setPrototypeOf(success, null);
    }

    static async getAllThongTinLuong(idnv){
        const chitietluong = await NhanVien
            .scope('withAllChiTietLuong')
            .findOne({ where: {idnv: idnv} })

        if (!chitietluong)
            return Promise.reject(ErrorHandler.createError('rs_not_found', { fields: ['idnv'] }));
        return chitietluong;
    }
}

module.exports = NhanVien;