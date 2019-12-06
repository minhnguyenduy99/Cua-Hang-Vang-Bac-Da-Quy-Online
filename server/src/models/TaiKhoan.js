const DBInterface           = require('./DBInterface');
const uuid                  = require('uuid');
const encryptor             = require('../helpers/encryptor');
const sequelize             = require('sequelize');
const validator             = require('../config/application-config');
const BaseModel             = require('./BaseModel');
const DateHelper            = require('../helpers/date-helper');
const ImageManager          = require('./ImageManager').getInstance();

const sqlInstance           = DBInterface.getSequelizeInstance();
const appValidator          = validator.dataValidator;
const globalDataValidator   = validator.AppGlobalRule;



const generateSaltAndPassword = (taikhoan) => {
    if (taikhoan.changed('matkhau')){
        taikhoan.salt = encryptor.createSalt();
        taikhoan.matkhau = encryptor.encrypt(taikhoan.matkhau, taikhoan.salt);
    }
}

class TaiKhoan extends BaseModel{

    static async initModel(){
        await BaseModel.initModel();
        const { deletedAt, updatedAt, createdAt } = BaseModel.timeStampsObj;

        TaiKhoan.init({
            idtk: {
                type: sequelize.UUID,
                primaryKey: true,
                allowNull: false,
                defaultValue: function(){
                    return uuid();
                },
                field: 'IDTK',
            },
            tendangnhap: {
                type: sequelize.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    is: appValidator.TenTaiKhoan
                },
                field: 'TenDangNhap',
            },
            matkhau: {
                type: sequelize.STRING,
                allowNull: false,
                validate: {
                    is: appValidator.MatKhau
                },
                field: 'MatKhau'
            },
            loaitk: {
                type: sequelize.INTEGER,
                allowNull: false,
                validate: {
                    isIn: {
                        args: [Object.values(globalDataValidator.LOAI_TAI_KHOAN)],
                    }
                },
                field: 'LoaiTK',
            },
            hoten: {
                type: sequelize.STRING,
                allowNull: false,
                field: 'HoTen'
            },
            cmnd: {
                type: sequelize.STRING(13),
                allowNull: false,
                unique: true,
                validate: {
                    is: appValidator.CMND 
                },
                field: 'CMND'
            },
            ngaysinh: {
                type: sequelize.DATEONLY,
                allowNull: true,
                validate: {
                    age_invalid(value){
                        const min_transaction_age = globalDataValidator.DataConfiguration.TUOI_THUC_HIEN_GIAO_DICH;
                        const age = new Date().getFullYear() - value.getFullYear();
                        if (age < min_transaction_age)
                            throw BaseModel.validationError(6, 'Tuổi từ 18 trở lên');
                    },
                    year_valid(value){
                        if (!DateHelper.isValidYearRange(value, [0, new Date().getFullYear()])){
                            throw BaseModel.validationError(6, 'Năm không hợp lệ');
                        }
                    }  
                },
                set(value){
                    this.setDataValue('ngaysinh', DateHelper.parseFrom(value));
                },
                field: 'NgaySinh'
            },
            gioitinh: {
                type: sequelize.STRING(8),
                set(value) {
                    this.setDataValue('gioitinh', value.toUpperCase());
                },
                validate: {
                    isIn: {
                        args: [appValidator.GioiTinh.args],
                        msg: appValidator.GioiTinh.msg
                    }
                },
                field: 'GioiTinh'
            },
            sdt: {
                type: sequelize.STRING(11),
                allowNull: false,
                validate: {
                    is: appValidator.SDT,
                },
                field: 'SDT'
            },
            diachi: {
                type: sequelize.TEXT,
                allowNull: true,
                field: 'DiaChi'
            },
            anhdaidien: {
                type: sequelize.STRING,
                field: 'AnhDaiDien',
                defaultValue: null,
            },
            ghichu: {
                type: sequelize.TEXT,
                allowNull: true,
                field: 'GhiChu'
            },
            salt: {
                type: sequelize.STRING,
                field: 'Salt'
            },
        },
        {
            timestamps: true,
            deletedAt: deletedAt,
            createdAt: createdAt,
            updatedAt: updatedAt,
            paranoid: true,
            sequelize: sqlInstance,
            tableName: 'TaiKhoan',
            hooks: {
                beforeCreate: generateSaltAndPassword,
                beforeUpdate: generateSaltAndPassword,
            },
        })
    }

    getUpdatableFieldList(){
        return ['tendangnhap', 'matkhau', 'gioitinh', 'anhdaidien', 'salt']
    }

    static async setAssociations(){
        const KhachHang = require('./KhachHang');
        const NhanVien  = require('./NhanVien');
        
        TaiKhoan.hasOne(KhachHang, {
            as: 'khachhang',
            foreignKey: {
                name: 'idtk',
                allowNull: true
            }
        })

        TaiKhoan.hasOne(NhanVien, {
            as: 'nhanvien',
            foreignKey: {
                name: 'idtk',
                allowNull: true
            },
        })
    }

    static async defineScopes(){
        const NhanVien = require('./NhanVien');
        const KhachHang = require('./KhachHang');

        TaiKhoan.addScope('defaultScope', {
            attributes: {
                exclude: ['tendangnhap', 'matkhau', 'salt']
            },
        })

        TaiKhoan.addScope('authenticate', (tendangnhap) => {
            return{
                where: { tendangnhap: tendangnhap }
            }
        })

        TaiKhoan.addScope('withAssociatedModel', (model, loaitk) => {
            return {
                include: [{model: model, as: model.name.toLowerCase() }] 
            }
        })

        TaiKhoan.addScope('withNhanVien', {
            include: [{ model: NhanVien, as: 'nhanvien' }]
        })

        TaiKhoan.addScope('withKhachHang', {
            include: [{ model: KhachHang, as: 'khachhang'}]
        })

        TaiKhoan.addScope('withAllInfos', {
            attributes: { exclude: []}
        });
    }

    isPasswordCorrect(enteredPassword){
        return encryptor.encrypt(enteredPassword, this.salt) === this.matkhau;
    }

    static async authenticate(loaitk, tendangnhap, matkhau){
        const mappingModel = this.getMappingTypeModel(loaitk);

        const taikhoan = await TaiKhoan.scope([
            { method: ['authenticate', tendangnhap] },
            { method: ['withAssociatedModel', mappingModel] }
        ]).findOne();

        if (!taikhoan || !taikhoan.isPasswordCorrect(matkhau))
                return null;

        return taikhoan;
    }

    static findAllTaiKhoan(taikhoanType){
        const {model, loaitk} = this.getMappingTypeModel(taikhoanType);
        return TaiKhoan.scope([
            'defaultScope', 
            { method: ['withAssociatedModel', model, loaitk.ma] }
        ]).findAll();
    }

    static async register(object, loaitk){
        const model = this.getMappingTypeModel(loaitk);
        object[model.name.toLowerCase()] = {...object};
        object.loaitk = loaitk;
        
        return sqlInstance.transaction((t) => {
            return TaiKhoan.create(object, {
                include: [{model: model, as: model.name.toLowerCase() }],
                transaction: t 
            })
        })
        .then((newModelObj) => {
            return newModelObj.getPlainObjExclude(['tendangnhap', 'matkhau', 'salt'])
            .then(plainObj => {
                return plainObj;
            })
        })
        .catch(err => {
            return Promise.reject(err);
        })
    }

    static getMappingTypeModel(loaitk){
        const loaiTKList = globalDataValidator.LOAI_TAI_KHOAN;

        if (loaitk === loaiTKList.KHACH_HANG){
            return require('./KhachHang');
        }

        return require('./NhanVien');
    }

    async updateModel(updateObj, transaction = null){
        let anhdaidien = updateObj.anhdaidien ? this.anhdaidien : null;
        
        const updateResult = await super.updateModel(updateObj, transaction);

        if (!anhdaidien)
            return updateResult;
        
        if (updateResult.success)
            ImageManager.deleteImage(updateObj.modelname, anhdaidien);
        
        return updateResult;
    }
}

module.exports = TaiKhoan;
