const ChiTietPhieu = require('./ChiTietPhieu');
const sequelize    = require('sequelize');
const sqlInstance  = require('./DBInterface').getSequelizeInstance();
const appConfig    = require('../config/application-config');
const Phieu        = require('./Phieu');
const DichVu       = require('./DichVu');

const appDataConfig     = appConfig.AppGlobalRule.DataConfiguration;
const dataValidation    = appConfig.dataValidator;

class CTPhieuDichVu extends ChiTietPhieu{

    static async initModel(){
        this._checkBase();

        CTPhieuDichVu.init({
            idphieu: {
                type: sequelize.STRING(Phieu.getModelIDLength()),
                primaryKey: true,
                field: 'IDPhieu',
            },
            iddv: {
                type: sequelize.STRING(DichVu.getModelIDLength()),
                primaryKey: true,
                field: 'IDDV',
            },
            idnv: {
                type: sequelize.UUID,
                primaryKey: true,
                field: 'IDNV',
            },
            soluong: {
                type: sequelize.INTEGER,
                allowNull: false,
                defaultValue: 1,
                validate: {
                    is: dataValidation.SoLuong,
                    invalid_soluong(value, done){
                        if (value == 0){
                            done(CTPhieuDichVu.validationError(6));
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
                validate: {
                    is: dataValidation.TienTe
                }
            }
        }, {
            sequelize: sqlInstance,
            timestamps: false,
            tableName: 'CTPhieuDichVu',
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
        const DichVu   = require('./DichVu');
        const NhanVien = require('./NhanVien');
        
        CTPhieuDichVu.belongsTo(DichVu, {
            as: 'dichvu',
            foreignKey: {
                name: 'iddv',
                allowNull: false
            }
        })

        CTPhieuDichVu.belongsTo(NhanVien, {
            as: 'nhanvien',
            foreignKey: {
                name: 'idnv',
                allowNull: false
            }
        })
    }

    async _updateBeforeCreate(){
        const dichvu = await DichVu.findOne({ 
            where: { iddv: this.getDataValue('iddv' )}
        })
        
        if (!dichvu) return;

        await this._updateGiaTri(dichvu.giagiacong);
    }

    async _updateGiaTri(giadv){
        this.setDataValue('giatri', giadv * this.soluong);
    }

    static getAssociatedPhieuName(){
        return 'danhsach_ctdichvu';
    }
}

module.exports = CTPhieuDichVu;