const sequelize         = require('sequelize');
const BaoCao            = require('./BaoCao');
const Phieu             = require('./Phieu');
const appConfig         = require('../config/application-config');
const DateHelper        = require('../helpers/date-helper');

const Op                = sequelize.Op;
const globalValidator   = appConfig.AppGlobalRule;

class BaoCaoDoanhThu extends BaoCao{


    static _getListLoaiPhieu(){
        return [3, 1, 2, 6];
    }


    // ** OVERRIDDEN METHOD GROUP
    // =====================================

    static async _getAllPhieuBaoCaoID(phieuObj){
        const PhieuCamDo = require('./PhieuCamDo');
        const [camdo, ...listLoaiPhieu] = this._getListLoaiPhieu();
        
        const ngaybd = DateHelper.parseToYearMonth(phieuObj.thoigianbd);
        const ngaykt = DateHelper.parseToYearMonth(phieuObj.thoigiankt);
        

        const listPhieuID = await Phieu
            .scope({ method: ['byThoiGian', ngaybd, ngaykt] })
            .findAll({
                raw: true,
                attributes: ['idphieu'],
                where: {
                    idloaiphieu: {
                        [Op.in]: listLoaiPhieu
                    },
                },
            })

        const listPhieuCamDoID = await Phieu
            .scope({ method: ['byThoiGian', ngaybd, ngaykt] })
            .findAll({
                raw: true,
                attributes: ['idphieu'],
                where: { idloaiphieu: camdo },
                include: [
                    {
                        model: PhieuCamDo,
                        as: PhieuCamDo.getAssociatedModelName(),
                        attributes: ['tinhtrang'],
                        where: { tinhtrang: globalValidator.TINH_TRANG_PHIEU_CAM_DO.DA_THANH_TOAN }
                    }
                ]
            })

        return listPhieuID.concat(listPhieuCamDoID).map(phieu => phieu.idphieu);
    }
}

module.exports = BaoCaoDoanhThu;