const KhachHang = require('../models/KhachHang');
const responser = require('./baseController');
const TaiKhoan = require('../models/TaiKhoan');
const ImageManager = require('../models/ImageManager').getInstance();
const ListLTK     = require('../config/application-config').AppGlobalRule.LOAI_TAI_KHOAN;

exports.GetAllKhachHang_GET = (req, res, next) => {
    KhachHang.findAllKhachHang()
    .then(listKhachHang => {
        req.result = responser.get({ data: listKhachHang });
        next();
    })
    .catch(err => next(err));
}

exports.CreateNewKhachHang_POST = (req, res, next) => {

    TaiKhoan.register(req.body, ListLTK.KHACH_HANG)
    .then(newKhachHang => {
        if (newKhachHang)
            req.result = responser.created({ data: newKhachHang });
        next();
    })
    .catch(err => {
        // delete the created image of model instance
        ImageManager.deleteImage('KhachHang', req.body.anhdaidien);
        next(err);
    });
}

exports.GetKhachHang_IDKH = (req, res, next) => {
    const IDKH = req.params.kh_id;

    KhachHang.findKhachHangByIDKH(IDKH)
    .then(khachhang => {
        req.result = responser.get({ data: khachhang });
        next();
    })
    .catch(err => next(err));
}

exports.GetAllPhieuMuaHang_IDKH_GET = (req, res, next) => {
    const idkh = req.params.kh_id;
    const idloaiphieu = parseInt(req.params.id_loaiphieu);
    
    KhachHang.findPhieuByIDKH(idkh, idloaiphieu)
    .then(khachang_phieu => {
        req.result = responser.get({ data: khachang_phieu });
        next();                     
    })    
    .catch(err => next(err));
}

exports.UpdateThongTinKhachHang_POST = (req, res, next) => {
    const idkh = req.params.kh_id;

    KhachHang.updateThongTin(idkh, req.body)
    .then((success) => {
        req.result = responser.updated({ options: {success: success} });
        next();
    })
    .catch(err => next(err));
}