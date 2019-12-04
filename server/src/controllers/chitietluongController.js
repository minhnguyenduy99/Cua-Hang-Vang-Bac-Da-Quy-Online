const ChiTietLuong      = require('../models/ChiTietLuong');
const responser         = require('./baseController');
const NhanVien          = require('../models/NhanVien');


module.exports.GetChiTietLuongNhanVien_GET = (req, res, next) => {
    const idnv = req.params.nv_id;

    NhanVien.getAllThongTinLuong(idnv)
    .then(nhanvien => {
        req.result = responser.get({ data: nhanvien });
        next();
    })
    .catch(err => next(err));
}

module.exports.CreateChiTietLuongNhanVien_GET = (req, res, next) => {
    const {danhsach_diemdanh, thang, nam} = req.body;

    ChiTietLuong.createAllChiTietLuong(danhsach_diemdanh, thang, nam)
    .then(listCTLuong => {
        req.result = responser.created({ data: listCTLuong });
        next();
    })
    .catch(err => next(err));
}