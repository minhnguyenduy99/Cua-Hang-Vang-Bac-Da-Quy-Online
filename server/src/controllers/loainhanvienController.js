const responser = require('./baseController');
const LoaiNhanVien = require('../models/LoaiNhanVien');

module.exports.GetAllLoaiNhanVien_GET = (req, res, next) => {
    LoaiNhanVien.findAll({
        order: [['ID_LNV', 'ASC']]
    })
    .then(listLNV => {
        if (listLNV){
            next(responser.getRetrieveRespone({ data: listLNV }));
        }
    })
    .catch(err => next(responser.getErrorRespone({ err: err })));
}

module.exports.CreateNewLoaiNhanVien_POST = (req, res, next) => {
    const loaiNV = { TenLNV: req.body.loai_nv };
    LoaiNhanVien.create(loaiNV)
    .then(newLNV => {
        if (newLNV){
            next(responser.getCreatedRespone({ data: newLNV, message: 'Tạo loại nhân viên mới thành công' }));
        }
    })
    .catch(err => next(responser.getErrorRespone({ err: err })));
}

module.exports.DeleteLoaiNhanVien_DELETE = (req, res, next) => {
    const ID_LNV = req.params.id_lnv;

    LoaiNhanVien.destroy({
        where: {ID_LNV: ID_LNV}
    })
    .then(number => {
        if (number == 1){
            next(responser.getDeleteRespone({ err: null, message: 'Xóa loại nhân viên thành công' }));
        }
        else{
            next(responser.getErrorRespone({ err: 'Xóa loại nhân viên thất bại' }));
        }
    })
    .catch(err => next(responser.getErrorRespone({ err: err })));
}