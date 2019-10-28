const KhachHang = require('../models/KhachHang');
const responser = require('./baseController');

exports.GetAllKhachHang_GET = (req, res, next) => {
    KhachHang.findAll()
    .then(listKhachHang => {
        if (listKhachHang){
            next(responser.getRetrieveRespone({ data: listKhachHang }));
        }
        else{
            next(responser.getErrorRespone({ err: 'Retrieve data failed' }));
        }
    })
    .catch(err => {
        responser.getErrorRespone({ err: err});
    });
}

exports.CreateNewKhachHang_POST = (req, res, next) => {
    const khachHang = req.body.khachHang;

    KhachHang.create(khachHang)
    .then(newKhachHang => {
        if (newKhachHang){
            next(responser.getCreatedRespone({ data: newKhachHang, message: 'Tạo khách hàng mới thành công' }));
        }
        else{
            next(responser.getErrorRespone({ err: 'Tạo khách hàng thất bại' }));
        }
    })
    .catch(err => {
        next(responser.getErrorRespone({ err: err }))
    })
}

exports.DeleteKhachHang_DELETE = (req, res, next) => {
    const kh_id = req.params.kh_id;
    
    KhachHang.findOne({
        where: {ID_KH: kh_id}
    })
    .then(khachHang => {
        if (khachHang){
            khachHang.delete()
            .then(success => {
                if (success)
                    next(responser.getDeleteRespone({ message: 'Xóa khách hàng thành công'}));
            })
        }
        else{
            next(responser.getErrorRespone({ statusCode: 400, err: 'Không tìm thấy khách hàng cần xóa' }))
        }
    })
    .catch(err => {
        responser.getErrorRespone({ err: err })
    });
}