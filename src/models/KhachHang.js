const sequelize             = require('sequelize');
const uuid                  = require('uuid');
const dbInterface           = require('./DBInterface');
const appConfig             = require('../config/application-config');
const BaseModel             = require('./BaseModel');
const Phieu                 = require('./Phieu');
const ErrorHandler          = require('../middlewares/error-handler').ErrorHandler;
const TaiKhoan              = require('./TaiKhoan');

const { dataValidator: appValidator, AppGlobalRule } = appConfig;
const sqlInstance           = dbInterface.getSequelizeInstance();

class KhachHang extends BaseModel{

    static async initModel(){
        KhachHang.init({
            idkh: {
                type: sequelize.UUID,
                primaryKey: true,
                defaultValue: function() {
                    return uuid();
                },
                field: 'IDKH'
            },
            tonggiatrimua: {
                type: sequelize.INTEGER,
                defaultValue: 0,
                validate: {
                    is: appValidator.TienTe
                },
                field: 'TongGiaTriMua',
            },
            tonggiatriban: {
                type: sequelize.INTEGER,
                defaultValue: 0,
                validate: {
                    is: appValidator.TienTe
                },
                field: 'TongGiaTriBan',
            }
        },{
            tableName: 'KhachHang',
            timestamps: false,
            sequelize: sqlInstance,
            hooks: {
                afterFind: async (khachhangs, options) => {
                    if (khachhangs instanceof KhachHang){
                        await khachhangs.updateGiaTriMuaVaBan(); 
                        return;
                    }
                    if (khachhangs instanceof Array){
                        await Promise.all(khachhangs.map(async (khachhang) => {
                            await khachhang.updateGiaTriMuaVaBan();
                        }))
                        return;
                    }
                },
            }
        })
    }

    getUpdatableFieldList(){ return []; }

    static async setAssociations(){
        const TaiKhoan = require('./TaiKhoan');
        const Phieu    = require('./Phieu');

        KhachHang.TaiKhoan = KhachHang.belongsTo(TaiKhoan, {
            as: 'taikhoan',
            foreignKey: {
                name: 'idtk',
                allowNull: true
            }
        })

        KhachHang.DanhSachPhieu = KhachHang.hasMany(Phieu, {
            as: 'danhsach_phieu',
            foreignKey: {
                name: 'idkh',
            }
        });
    }

    static async defineScopes(){

        KhachHang.addScope('withTaiKhoan', {
            include: [{ association: KhachHang.TaiKhoan }]
        })

        KhachHang.addScope('withTaiKhoanUpdate', {
            include: [{
                association: KhachHang.TaiKhoan,
                as: 'taikhoan',
                attributes: { exclude: [] }    
            }]
        })

        KhachHang.addScope('withPhieu', (idloaiphieu) => {
            const ChiTietModel = Phieu.getPhieuModel(idloaiphieu)._getChiTietModel();
            return {
                include: [ 
                    { 
                        association: KhachHang.DanhSachPhieu,
                        where: { idloaiphieu : idloaiphieu },
                        include: [
                            {
                                model: ChiTietModel,
                                as: ChiTietModel.getAssociatedPhieuName()
                            }
                        ] 
                    }
                ]
            }
        })
    }

    async getTongGiaTriPhieu(){
        let [results, metadata] = await sqlInstance.query(
            `SELECT SUM(TongGiaTri) as giatri FROM Phieu
            WHERE IdLoaiPhieu = 1 AND IDKH = \'${this.idkh}\'
            UNION
            SELECT SUM(TongGiaTri) as giatri FROM Phieu
            WHERE IdLoaiPhieu = 4 AND IDKH = \'${this.idkh}\'` 
        )
        let values = [0, 0]
        results.forEach((result, index) => {
            values[index] = parseInt(result.giatri) || 0;
        })
        return {
            tonggiatrimua: values[0],
            tonggiatriban: values[1],
        }
    }

    async updateGiaTriMuaVaBan(){
        const value = await this.getTongGiaTriPhieu();
        this.set('tonggiatriban', value.tonggiatriban);
        this.set('tonggiatrimua', value.tonggiatrimua);
    }
    
    async updateTongGiaTriMua(){
        const Phieu = require('./Phieu');
        return Phieu.sum(sequelize.col('tonggiatri'), {
            where: {idkh: this.getDataValue('idkh')}
        })
        .then(tonggiatri => {
            this.setDataValue('tonggiatrimua', tonggiatri);
            return tonggiatri;
        })
        .catch(err => {
            return Promise.reject(err);
        })
    }

    async updateTongGiaTriMuaThem(giatriThem){
        try{
            const newGiaTriMua = this.tonggiatrimua + giatriThem;
            return this.update({tonggiatrimua: newGiaTriMua}, {fields: ['tonggiatrimua']});
        }
        catch(err) {
            return Promise.reject(err);
        }
    }

    static findAllKhachHang(){
        return KhachHang.scope('withTaiKhoan').findAll()
        .then(listKH => {
            return listKH;
        });
    }

    static findKhachHangByIDKH(idkh){
        return KhachHang.scope('withTaiKhoan').findOne({
            where: {idkh: idkh}
        })
    }

    static findKhachHangForUpdateByID(idkh){
        return KhachHang.scope('withTaiKhoanUpdate').findOne({
            where: {idkh: idkh}
        })
    }

    static async authenticate(tendangnhap, matkhau){
        const loaitk = AppGlobalRule.LOAI_TAI_KHOAN.KHACH_HANG;
        const taikhoan = await TaiKhoan.authenticate(loaitk, tendangnhap, matkhau);

        if (!taikhoan || !taikhoan.khachhang)
            return null;
        
        const { idtk, khachhang: { idkh } } = taikhoan;

        return { idtk, idkh, loaitk };
    }

    static findPhieuByIDKH(idkh, idloaiphieu){
        if (!idloaiphieu)
            return null;
        
        return KhachHang.scope({ method: ['withPhieu', idloaiphieu] }).findOne({
            where: {idkh: idkh},
        })
        .then(khachhang => {
            return khachhang;
        })
        .catch(err => {
            throw err;
        })
    }

    static async updateThongTin(idkh, updateObj){
        updateObj.modelname = 'khachhang';          //      Chỉ đinh tên của model ứng với tài khoản
        
        const khachhang = await this.findKhachHangForUpdateByID(idkh);
        if (!khachhang){
            throw ErrorHandler.createError('rs_not_found', {fields: ['idkh']});
        }
        const taikhoan = khachhang.taikhoan;

        const success = await sqlInstance.transaction(async (t) => {
            const results = await Promise.all([
                khachhang.updateModel(updateObj, t),
                taikhoan.updateModel(updateObj, t)
            ])
            return results.reduce((pre, cur) => pre && cur);
        })

        return success;
    }

    static async deletekhachHang(idkh){
        const khachhang = await KhachHang.scope('withTaiKhoan').findOne({
            where: { idkh: idkh }
        })

        if (!khachhang)
            return null;

        const idtk = khachhang.taikhoan.idtk;

        await khachhang.destroy();
        await TaiKhoan.destroy({
            where: { idtk: idtk }
        })

        return KhachHang.findAllKhachHang();
    }
}

module.exports = KhachHang;