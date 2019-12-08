const sequelize     = require('sequelize');
const Phieu         = require('./Phieu');
const sqlInstance   = require('./DBInterface').getSequelizeInstance();
const appConfig     = require('../config/application-config');
const ErrorHandler  = require('../middlewares/error-handler').ErrorHandler;

const NhaCungCap    = require('./NhaCungCap');

class PhieuNhapKho extends Phieu{

    static async initModel(){

        PhieuNhapKho.init({
            idphieu: {
                type: sequelize.STRING(Phieu.getModelIDLength()),
                primaryKey: true,
                field: 'IDPhieu'
            },
            idnhacc: {
                type: sequelize.UUID,
                allowNull: false,
                field: 'IDNhaCC',
            }
        },{
            sequelize: sqlInstance,
            timestamps: false,
            tableName: 'PhieuNhapKho',
        })
    }

    static setAssociations(){
        const NhaCungCap      = require('./NhaCungCap');

        PhieuNhapKho.belongsTo(Phieu, {
            as: 'phieu',
            foreignKey: 'idphieu'
        })

        PhieuNhapKho.NhaCungCap = PhieuNhapKho.belongsTo(NhaCungCap, {
            as: 'nhacungcap',
            foreignKey: 'idnhacc'
        })
    }

    static defineScopes(){}

    static _isAdditionModelEmpty(){
        return false;
    }

    static getAssociatedModelName(){
        return 'thongtin_nhapkho';
    }

    static findAllByIDNhaCC(idnhacc){
        const whereLiteral = `${PhieuNhapKho.getAssociatedModelName()}.idnhacc = \'${idnhacc}\'`;
        return Phieu.getFindAllScope(7).findAll({
            where: sequelize.literal(whereLiteral)
        })
    }

    static async _beforeCreateHook(phieuObj){
        const ChiTietPhieu = require('./ChiTietPhieu');
        await super._beforeCreateHook(phieuObj);
        ChiTietPhieu.setCheckSoLuong(false);
    }

    static async _customValidate(phieuObj){
        const ChiTietModel = PhieuNhapKho._getChiTietModel();

        const { err: chucvu_err } = await validateChucVu(phieuObj.idnv);
        if (chucvu_err)  return { err: chucvu_err }

        const { err: sanpham_err } = await validateSanPham(
            phieuObj[PhieuNhapKho.getAssociatedModelName()].idnhacc, 
            phieuObj[ChiTietModel.getAssociatedPhieuName()]) 

        if (sanpham_err) return { err: sanpham_err }
        return { err: null }


        // local funcitons     
        async function validateChucVu(idnv){
            const NhanVien = require('./NhanVien');
    
            const nhanvien = await NhanVien.findOne({ where: { idnv: idnv }}); 
            if (!nhanvien)
                return { err: ErrorHandler.createError('invalid_value', { fields: ['idnv'] }) };
            return { err: null }
        }
        async function validateSanPham(idnhacc, listCTNhapKho){
            const NhaCungCap = require('./NhaCungCap');
            const listSanPhamID = (await NhaCungCap.findAllSanPham(idnhacc)).danhsach_sanpham
                                .map(sanpham => sanpham.idsp);

            for(let chitiet of listCTNhapKho){
                const idsp = chitiet.idsp;
                // Không tìm thấy sản phẩm
                if (listSanPhamID.indexOf(idsp) === -1){
                    return { err: ErrorHandler.createError('rs_not_found', { fields: ['idsp']}) };
                }
            }
        
            return { err: null }
        }
    }

    static async _afterCreateHook(phieu){
        await super._updatePhieu(phieu);

        PhieuNhapKho._updateChiTiet(phieu);

        PhieuNhapKho._updateNhaCC(phieu);
    }

    static async _updateChiTiet(phieu){
        const listCTPhieu = this._getListCTPhieu(phieu);
        const SanPham = require('./SanPham');

        listCTPhieu.forEach(async (ctphieu) => {
            const soluongThem = ctphieu.getDataValue('soluong');
            const sanpham = await SanPham.findSanPhamByID(ctphieu.idsp); 
            const soLuongMoi = sanpham.getDataValue('soluong') + soluongThem;
            sanpham.setDataValue('soluong', soLuongMoi);
            sanpham.save().then(value => {
                console.log(value.soluong);
            });
        })
    }

    static async _updateNhaCC(phieu){
        const idnhacc = phieu[PhieuNhapKho.getAssociatedModelName()].idnhacc;
        const nhacungcap = await NhaCungCap.findOne({ where: { idnhacc: idnhacc }});
        const newGiaTriNhap = nhacungcap.getDataValue('tonggiatrinhap') + phieu.tonggiatri;
        nhacungcap.update({ tonggiatrinhap: newGiaTriNhap }, { fields: ['tonggiatrinhap'] });
    }
}


module.exports = PhieuNhapKho;