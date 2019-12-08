const ChiTietPhieu = require('./ChiTietPhieu');
const sequelize    = require('sequelize');
const sqlInstance  = require('./DBInterface').getSequelizeInstance();
const appConfig    = require('../config/application-config');

const appDataConfig     = appConfig.AppGlobalRule.DataConfiguration;
const dataValidation    = appConfig.dataValidator;

class CTPhieuCamDo extends ChiTietPhieu{
    static async initModel(){
        this._checkBase();

        CTPhieuCamDo.init({
            phantramgiacam: {
                type: sequelize.DOUBLE,
                allowNull: false,
                defaultValue: appDataConfig.TI_LE_CAM_DO_MAX,
                validate: {
                    is: dataValidation.TiLePhanTram,
                    valid_range(value){
                        const maxVal = appDataConfig.TI_LE_CAM_DO_MAX;
                        if (value > maxVal)
                            throw CTPhieuCamDo.validationError(6, 'Tỉ lệ cao nhất là 90%');
                    },
                },
                field: 'PhanTramCamDo'
            },
            soluong: {
                type: sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
                validate: {
                    is: dataValidation.SoLuong,
                    invalid_soluong(value, done){
                        if (value == 0){
                            done(CTPhieuCamDo.validationError(6));
                            return;
                        }
                        done();
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
            tableName: 'CTPhieuCamDo',
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
            },
        })
    }

    static async setAssociations(){
        const SanPham = require('./SanPham');
        const Phieu   = require('./Phieu');

        CTPhieuCamDo.SanPham = CTPhieuCamDo.belongsTo(SanPham, {
            as: 'sanpham',
            foreignKey: {
                name: 'idsp',
                allowNull: false,
            },
        });

        CTPhieuCamDo.Phieu = CTPhieuCamDo.belongsTo(Phieu, {
            as: 'phieu',
            foreignKey: {
                name: 'idphieu',
                allowNull: false
            }
        })
    }

    async _updateGiaTri(giaban){
        const giatriCTPhieu = giaban * this.soluong * this.phantramgiacam;
        this.set('giatri', giatriCTPhieu);
    }

    static getAssociatedPhieuName(){
        return 'danhsach_ctcamdo';
    }
}

module.exports = CTPhieuCamDo;