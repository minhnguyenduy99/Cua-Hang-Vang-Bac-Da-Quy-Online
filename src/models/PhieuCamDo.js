const sequelize         = require('sequelize');
const validator         = require('../config/application-config');
const Phieu             = require('./Phieu');
const sqlInstance       = require('./DBInterface').getSequelizeInstance();
const DateHelper        = require('../helpers/date-helper');
const ErrorHandler      = require('../middlewares/error-handler').ErrorHandler;

const globalDataValidator   = validator.dataValidator;
const localDataValidator    = validator.AppGlobalRule;

class PhieuCamDo extends Phieu{
    static async initModel(){
        PhieuCamDo.init({
            idphieu: {
                type: sequelize.STRING(Phieu.MODEL_ID_LENGTH),
                primaryKey: true,
                field: 'IDPhieu'
            },
            ngaycam: {
                type: sequelize.DATEONLY,
                allowNull: false,
                defaultValue: () => new Date(),
                field: 'NgayCam',
                set(value){
                    this.setDataValue('ngaycam', DateHelper.parseFrom(value));
                },
            },
            ngaytra: {
                type: sequelize.DATEONLY,
                allowNull: false,
                field: 'NgayTra',
                set(value){
                    this.setDataValue('ngaytra', DateHelper.parseFrom(value));
                },
                validate: {
                    isSauNgayCam(value){
                        const ngaycam = this.getDataValue('ngaycam');
                        if (value < ngaycam)
                            throw new Error('Ngày trả không hợp lệ');
                    }
                }
            },
            laisuat: {
                type: sequelize.DOUBLE,
                allowNull: false,
                validate: {
                    is: globalDataValidator.TiLePhanTram
                },
                field: 'LaiSuat'
            },
            tienlai: {
                type: sequelize.INTEGER.UNSIGNED,
                validate: {
                    is: globalDataValidator.TienTe
                },
                defaultValue: 0,
                field: 'TienLai',
                set(value){
                    const intVal = Math.round(value);
                    // làm trong giá trị cho giá trị gần nhất chia hết cho 500
                    this.setDataValue('tienlai', intVal - intVal % 500);
                }
            },
            tinhtrang: {
                type: sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,        //   Mặc định khi tạo phiếu là chưa trả
                validate: {
                    isIn: [Object.values(localDataValidator.TINH_TRANG_PHIEU_CAM_DO)]
                },
                field: 'TinhTrang'
            },
        }, {
            timestamps: false,
            sequelize: sqlInstance,
            tableName: 'PhieuCamDo',
        })
    }

    static async setAssociations(){

    }

    static async defineScopes(){
        PhieuCamDo.addScope('withTinhTrang', (tinhtrang) => {
            return {
                where: { tinhtrang: tinhtrang }, 
            }
        })
    }

    static async findAllPhieu(tinhtrang){
        const listPhieu = await Phieu.findAll({
            where: { idloaiphieu: 3 },
            include: [
                {
                    model: PhieuCamDo,
                    as: PhieuCamDo.getAssociatedModelName(),
                    attributes: [],
                    where: { tinhtrang: tinhtrang }
                }
            ]
        })
        return listPhieu;
    }

    static async _updateTongGiaTri(phieu, giatriGoc){
        const phieucamdo = phieu.getDataValue(PhieuCamDo.getAssociatedModelName());
        const { days: countNgay } = DateHelper.getDistanceBetweenTwoDates(phieu.ngaylapphieu, phieucamdo.ngaytra);
        const { SO_LUONG_NGAY, LAI_SUAT } = localDataValidator.DataConfiguration.LAI_SUAT_LINH_DONG;
        let tonggiatri = 0;

        // Sử dụng lãi suất mặc định (theo tháng)
        if (countNgay > SO_LUONG_NGAY){
            tonggiatri = giatriGoc * (1 + phieucamdo.laisuat); 
        }
        // Sử dụng lãi suất linh động
        else{
            tonggiatri = getLaiSuatLinhDong(giatriGoc, LAI_SUAT, countNgay);
        }
       
        await phieu.update({ tonggiatri: tonggiatri}, {fields: ['tonggiatri']})

        return phieu.tonggiatri;


        function getLaiSuatLinhDong(giatrigoc, laisuat, countNgay){
            const heSoNhan = laisuat + 1;
            return giatrigoc * Math.pow(heSoNhan, countNgay);
        }
    }

    


    // *** overrided method group ============================

    static _getChiTietModel(){
        return require('./CTPhieuCamDo');
    }

    static getAssociatedModelName(){
        return 'thongtin_phieucamdo';
    }

    static _customValidate(phieuObj){
        return {err: null}
    }

    static async _updatePhieu(phieu){
        let tongGiaTriGoc = this._getListCTPhieu(phieu)
            .map(ctphieu => ctphieu.getDataValue('giatri'))
            .reduce((pre, cur) => pre + cur);
        
        const phieucamdo = phieu.getDataValue(PhieuCamDo.getAssociatedModelName());        
        const tongGiaTriMoi = await PhieuCamDo._updateTongGiaTri(phieu, tongGiaTriGoc);

        phieucamdo.set('tienlai', tongGiaTriMoi - tongGiaTriGoc);

        await phieu.save();

        return phieu;
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
}


module.exports = PhieuCamDo;