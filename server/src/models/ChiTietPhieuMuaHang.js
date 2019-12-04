const ChiTietPhieu = require('./ChiTietPhieu');
const sequelize    = require('sequelize');
const sqlInstance  = require('./DBInterface').getSequelizeInstance();
const appConfig    = require('../config/application-config');
const SanPham      = require('./SanPham');

const appDataConfig     = appConfig.AppGlobalRule.DataConfiguration;
const dataValidation    = appConfig.dataValidator;

class ChiTietPhieuMuaHang extends ChiTietPhieu{
    static async initModel(){
        this._checkBase();

        ChiTietPhieuMuaHang.init({
            phantramgiamua: {
                type: sequelize.DOUBLE,
                allowNull: false,
                defaultValue: appDataConfig.TI_LE_GIA_THU_MUA_RANGE[0],
                validate: {
                    is: dataValidation.TiLePhanTram,
                    valid_range(value){
                        const range = appDataConfig.TI_LE_GIA_THU_MUA_RANGE;
                        if (value < range[0] || value > range[1])
                            throw ChiTietPhieuMuaHang.validationError(6, 'Tỉ lệ phải từ 0.5 - 0.9');
                    },
                },
                field: 'PhanTramGiaMua'
            },
            soluong: {
                type: sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
                validate: {
                    is: dataValidation.SoLuong,
                    invalid_soluong(value, done){
                        if (value == 0){
                            done(ChiTietPhieuMuaHang.validationError(6));
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
                                done(ChiTietPhieuMuaHang.validationError(6, 'Số lượng sản phẩm không đủ'));
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
                field: 'GiaTri',
                set(value){
                    const intVal = Math.round(value);
                    this.setDataValue('giatri', intVal - intVal % 500);
                }
            }
        }, {
            sequelize: sqlInstance,
            timestamps: false,
            tableName: 'ChiTietPhieuMuaHang',
            hooks: {
                beforeCreate(ctphieu, options){
                    return new Promise(async (resolve, reject) => {
                        try{
                            await ctphieu._updateBeforeCreate();
                            resolve();
                        }
                        catch(err){
                            reject(err);
                        }
                    })
                }
            }
        })
    }

    static async setAssociations(){

        const Phieu    = require('./Phieu');
        const SanPham  = require('./SanPham'); 

        // ChiTietPhieuMuaHang.Phieu = ChiTietPhieuMuaHang.belongsTo(Phieu, {
        //     as: 'phieu',
        //     foreignKey: {
        //         name: 'idphieu',
        //         allowNull: false
        //     }
        // })

        // ChiTietPhieuMuaHang.SanPham = ChiTietPhieuMuaHang.belongsTo(SanPham, {
        //     as: 'sanpham',
        //     foreignKey: {
        //         name: 'idsp',
        //         allowNull: false,
        //     },
        // });
    }

    async _updateGiaTri(giaban){
        const giatriCTPhieu = giaban * this.soluong * this.phantramgiamua;
        this.set('giatri', giatriCTPhieu);
    }

    static getAssociatedPhieuName(){
        return 'danhsach_ctmuahang';
    }
}

module.exports = ChiTietPhieuMuaHang;