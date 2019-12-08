const Phieu             = require('./Phieu');
const PhieuCamDo        = require('./PhieuCamDo');


class PhieuThuMua extends PhieuCamDo{

    static async setAssociations(){}
    static async defineScopes(){}

    static _getChiTietModel(){
        return require('./ChiTietPhieuMuaHang');
    }

    static getAssociatedModelName(){
        return 'thongtin_phieuthumua'
    }

    static _isAdditionModelEmpty(){
        return true;
    }

    static async _updatePhieu(phieu){
        await Phieu._updatePhieu(phieu);
    }
}

module.exports = PhieuThuMua;