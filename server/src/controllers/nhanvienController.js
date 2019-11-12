const responser = require('./baseController');
const NhanVien = require('../models/NhanVien');


module.exports.GetAllNhanVien_GET = (req, res, next) => {
    NhanVien.findAll()
    .then(listNhanVien => {
        if (listNhanVien){
            next(responser.getRetrieveRespone({ data: listNhanVien }));
        }
        else{
            next(responser.getErrorRespone({ err: 'Retrieve failed' }));
        }
    })    
    .catch(err => {
        next(responser.getErrorRespone({ err: err }));
    })
}

module.exports.CreateNewNhanVien_POST = (req, res, next) => {
    const nhanVien = req.body.nhanVien;
    NhanVien.create(nhanVien)
    .then(newNhanVien => {
        if (newNhanVien){
            next(responser.getCreatedRespone({ data: newNhanVien, message: 'Tạo nhân viên thành công' }))
        }
        else{
            next(responser.getErrorRespone({ message: 'Tạo nhân viên mới thất bại' }))
        }
    })
    .catch(err => {
        next(responser.getErrorRespone({ err: err }));
    })
}

module.exports.GetNhanVien_GET = (req, res, next) => {
    const id = req.params.id_nv;

    NhanVien.findNhanVienByID(id)
    .then(nhanVien => {
        if (nhanVien)
            next(responser.getRetrieveRespone({ data: nhanVien }));
        else
            next(responser.getRetrieveRespone({ message: 'Không tìm thấy nhân viên' }));
    })
    .catch(err => {
        next(responser.getErrorRespone({ err: err }));
    })
}

module.exports.DeleteNhanVien_DELETE = (req, res, next) => {
    const ID_NV = req.params.nv_id;
    NhanVien.findOne({
        where: {ID_NV: ID_NV}
    })
    .then(nhanVien => {
        if (nhanVien){
            nhanVien.delete()
            .then(success => {
                if (success){
                    next(responser.getDeleteRespone({ message: 'Xóa nhân viên thành công' }))
                }
                else{
                    next(responser.getErrorRespone({ message: 'Xóa nhân viên thất bại' }))
                }
            })
        }
        else{
            next(responser.getRetrieveRespone({ message: 'Không tìm thấy id nhân viên' }))
        }
    })
    .catch(err => {
        next(responser.getErrorRespone({ err: err }));
    })
}