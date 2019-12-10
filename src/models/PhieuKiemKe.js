const Phieu             = require('./Phieu');


class PhieuKiemKe extends Phieu{

    static async setAssociations(){}
    static async defineScopes(){}

    // Để trống vì phiếu kiểm kê không thay đổi gì ở chi tiết
    static async _updateChiTiet(phieu){}      
}

module.exports = PhieuKiemKe;