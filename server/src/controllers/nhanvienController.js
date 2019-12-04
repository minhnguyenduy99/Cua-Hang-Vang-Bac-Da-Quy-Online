const responser = require('./baseController');
const NhanVien = require('../models/NhanVien');
const TaiKhoan = require('../models/TaiKhoan');
const ImageManager = require('../models/ImageManager').getInstance();
const ListChucVu = require('../config/application-config').AppGlobalRule.CHUC_VU;
const ErrorHandler  = require('../middlewares/error-handler').ErrorHandler;
const ChiTietLuong    = require('../models/ChiTietLuong')

module.exports.GetAllNhanVien_GET = (req, res, next) => {
    NhanVien.findAllNhanVien()
    .then(listNhanVien => {
        req.result = responser.get({ data: listNhanVien });
        next();
    })    
    .catch(err => {
        next(err)
    });
}

module.exports.CreateNewNhanVien_POST = (req, res, next) => {
    const chucvu = req.body.chucvu = parseInt(req.body.chucvu);

    // Không tìm thấy chức vụ 
    if (Object.values(ListChucVu).indexOf(chucvu) === -1){
        const error = ErrorHandler.createError('invalid_value', { field: 'chucvu' })
        next(error);
        return;
    }

    TaiKhoan.register(req.body, chucvu)
    .then(newNhanVien => {
        if (newNhanVien)
            req.result = responser.created({ data: newNhanVien })
        next();
    })
    .catch(err => {
        ImageManager.deleteImage(NhanVien.name, req.body.anhdaidien);
        next(err);
    });
}

module.exports.GetNhanVien_IDNV = (req, res, next) => {
    const id = req.params.nv_id;

    NhanVien.findNhanVienByID(id)
    .then(nhanVien => {
        req.result = responser.get({ data: nhanVien });
        next();
    })
    .catch(err => next(err));
}

module.exports.UpdateThongTinNhanVien_POST = (req, res, next) => {
    const idnv = req.params.nv_id;

    NhanVien.updateThongTin(idnv, req.body)
    .then(success => {
        req.result = responser.updated({ options: {success: success} });
        next();
    })
    .catch(err => next(err));
}

module.exports.GetThongTinLuong_GET = (req, res, next) => {
    const idnv = req.params.nv_id;

    NhanVien.getAllThongTinLuong(idnv)
    .then(nhanvien => {
        req.result = responser.get({ data: nhanvien });
        next();
    })
    .catch(err => {
        next(err);
    });
}