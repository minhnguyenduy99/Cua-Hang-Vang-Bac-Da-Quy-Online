// module import
const sqlInstance    =   require('./DBInterface').getSequelizeInstance();
const sequelize      =   require('sequelize');
const validator      =   require('../config/application-config');
const DateHelper     =   require('../helpers/date-helper');
const Phieu          =   require('./Phieu');


const appGlobalValidator = validator.AppGlobalRule;

class PhieuDichVu extends Phieu{
   
    static async initModel(){

        PhieuDichVu.init({
            idphieu: {
                type: sequelize.STRING(Phieu.getModelIDLength()),
                primaryKey: true,
                field: 'IDPhieu'
            },
            ngaytra: {
                type: sequelize.DATE,
                defaultValue: () => new Date(),
                field: 'NgayTra',
                set(value){
                    this.setDataValue('ngaytra', DateHelper.parseFrom(value));
                },
                validate: {
                    isSauNgayCam(value){
                        if (value < new Date())
                            throw new Error('Ngày trả không hợp lệ');
                    }
                }
            },
            
            diadiemgiao: {
                type: sequelize.TEXT,
                field: 'DiaDiemGiao'
            },
            tinhtrang: {
                type: sequelize.INTEGER,
                defaultValue: appGlobalValidator.TINH_TRANG_PHIEU_DICH_VU.CHUA_LAM,
                validate: {
                    isIn: [Object.values(appGlobalValidator.TINH_TRANG_PHIEU_DICH_VU)]
                },
                field: 'TinhTrang'
            }
        }, {
            tableName: 'PhieuDichVu',
            timestamps: false,
            sequelize: sqlInstance,
        })
    }

    static async setAssociations(){
        PhieuDichVu.Phieu = PhieuDichVu.belongsTo(Phieu, {
            as: 'phieu',
            foreignKey: 'idphieu'
        })
    }

    static async defineScopes(){}


    // ** Overrided method group
    // =================================================

    static getAssociatedModelName(){
        return 'thongtin_dichvu';
    }

    static _getChiTietModel(){
        return require('./CTPhieuDichVu');
    }

    static async _updateChiTiet(phieu){
        // do nothings here
    }   

}


module.exports = PhieuDichVu;