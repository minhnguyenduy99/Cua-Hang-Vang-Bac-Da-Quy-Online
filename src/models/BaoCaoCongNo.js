const sequelize         = require('sequelize');
const BaoCao            = require('./BaoCao');
const Phieu             = require('./Phieu');
const appConfig         = require('../config/application-config');
const DateHelper        = require('../helpers/date-helper');

const Op                = sequelize.Op;
const globalValidator   = appConfig.AppGlobalRule;

class BaoCaoCongNo extends BaoCao{


    static _getListLoaiPhieu(){
        return [3, 4, 7];
    }

    // ** OVERRIDDEN METHOD GROUP
    // =====================================

    static async _getAllPhieuBaoCaoID(phieuObj){
        const PhieuCamDo = require('./PhieuCamDo');
        const [camdo, ...listLoaiPhieu] = this._getListLoaiPhieu();

        const ngaybd = DateHelper.parseToYearMonth(phieuObj.thoigianbd);
        const ngaykt = DateHelper.parseToYearMonth(phieuObj.thoigiankt);

        const promise_1 = getListPhieuCamDoID();
        const promise_2 = getListPhieuGhiNoID(listLoaiPhieu);

        const listListPhieu = await Promise.all([
            promise_1,
            promise_2
        ])

        return listListPhieu[0].concat(listListPhieu[1]).map(phieu => phieu.idphieu);

        // Tình trạng phiếu cầm đô là CHUA_TRA
        async function getListPhieuCamDoID(){
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
                            where: { tinhtrang: globalValidator.TINH_TRANG_PHIEU_CAM_DO.CHUA_TRA }
                        }
                    ]
                })
            return listPhieuCamDoID;
        }

        async function getListPhieuGhiNoID(listLoaiPhieu){
            const listPhieuGhiNoID = await Phieu
                .scope({ method: ['byThoiGian', ngaybd, ngaykt] })    
                .findAll({
                    raw: true,
                    attributes: ['idphieu'],
                    where: {
                        idloaiphieu: { [Op.in]: listLoaiPhieu },
                        tinhtrangno: globalValidator.TINN_TRANG_GHI_NO.GHI_NO
                    }
                })
            return listPhieuGhiNoID;
        }
    }
}

module.exports = BaoCaoCongNo;