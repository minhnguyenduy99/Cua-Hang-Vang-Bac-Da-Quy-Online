const DBInterface       = require('./DBInterface');
const sequelize         = require('sequelize');
const appValidator      = require('../config/application-config').dataValidator;
const SanPham           = require('./SanPham');
const Phieu             = require('./Phieu');
const BaseModel         = require('./BaseModel');


const instance          = DBInterface.getSequelizeInstance();

class ChiTietPhieu extends BaseModel{

    static async initModel(){
        ChiTietPhieu.init({
            soluong: {
                type: sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
                validate: {
                    is: appValidator.SoLuong,
                    invalid_soluong(value, done){
                        if (value == 0){
                            done(BaseModel.validationError(6));
                            return;
                        }
                        if (ChiTietPhieu.getCheckSoLuong()){
                            done();
                            return;
                        }
                        SanPham.findOne({
                            where: {idsp: this.idsp}
                        })
                        .then(sanpham => {
                            if (!sanpham){
                                done();
                                return;
                            }
                            if (value > sanpham.getDataValue('soluong')){
                                done(BaseModel.validationError(6, 'Số lượng sản phẩm không đủ'));
                                return;
                            }
                            done();
                        })
                    }
                },
                field: 'SoLuong',
            },
            giatri: {
                type: sequelize.INTEGER,
                defaultValue: 0,
                allowNull: false,
                field: 'GiaTri'
            }
        }, {
            tableName: 'ChiTietPhieu',
            timestamps: false,
            sequelize: instance,
            hooks: {
                beforeCreate(chitietphieu, options) {
                    return new Promise(async (resolve, reject) => {
                        try{
                            await chitietphieu._updateBeforeCreate();
                            resolve();
                        }
                        catch(err){ reject(err) }
                    });
                },
            },
            indexes: [
                { unique: true, name: 'idsp_idphieu', fields: ['idsp', 'idphieu'], }
            ]
        })
    }
    
    static setCheckSoLuong(value){
        ChiTietPhieu.checkSoLuong = value;
    }

    static getCheckSoLuong(){
        return ChiTietPhieu.checkSoLuong || true;
    }

    static async setAssociations(){
        const SanPham       = require('./SanPham');

        ChiTietPhieu.SanPham = ChiTietPhieu.belongsTo(SanPham, {
            as: 'sanpham',
            foreignKey: 'idsp'
        });
    }

    static updateBulkCTPhieu(listCTPhieu){
        return Promise.all(listCTPhieu.map(CTPhieu => {
            return CTPhieu._updateBeforeCreate();
        }));
    }

    static findAllCTPhieu(idphieu, loaiphieu){
        const ChiTietModel = Phieu.getPhieuModel(loaiphieu)._getChiTietModel();

        return ChiTietModel.findAll({
            where: { idphieu: idphieu }
        })
    }

    // ** Overridable methods ========================================

    // Lấy alias của association giữa Phieu va ChiTietPhieu
    // Chi tiết nào kế thừa từ ChiTietPhieu phải override hàm này
    static getAssociatedPhieuName(){
        return 'danhsach_ctphieu';
    }

    // Hàm này vẫn được gọi khi idsp chưa được validate. Do đó, cần kiểm tra sản phẩm có tồn tại hay không
    async _updateBeforeCreate(){
        const sanpham = await SanPham.findOne(
            { where: {idsp: this.idsp}
        });
        if (!sanpham)
            return;

        await this._updateGiaTri(sanpham.getDataValue('giaban'));
    }

    async _updateGiaTri(giaban){
        const soluong = this.getDataValue('soluong');
        const giatriCTPhieu = giaban * soluong;
        this.setDataValue('giatri', giatriCTPhieu);
    }

    //  =================================================================
}

module.exports = ChiTietPhieu;