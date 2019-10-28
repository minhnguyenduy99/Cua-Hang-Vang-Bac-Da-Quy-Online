const LoaiSanPham = require('../models/LoaiSanPham');
const responser = require('./baseController');
const router = require('express').Router();


module.exports.CreateNewLoaiSanPham_POST = (req, res, next) => {
    const tenLSP = req.body.lsp_ten;
    LoaiSanPham.create({ TenLSP: tenLSP})
    .then(newLSP => {
        if (newLSP){
            next(responser.getCreatedRespone({ data: newLSP }));
        }
        else{
            next(responser.getCreatedRespone({ success: false }));
        }
    })
    .catch(err => {
        next(responser.getErrorRespone({err: err}));
    })
}

module.exports.GetAllLoaiSanPham_GET = (req, res, next) => {
    LoaiSanPham.findAll()
    .then(listLSP => {
        if (listLSP){
            next(responser.getRetrieveRespone({ data: listLSP }));
        }
        else{
            throw new Error('Database retrieve failed');
        }
    })
    .catch(
        err => next(responser.getErrorRespone({ err: err }))
    );
}

module.exports.DeleteLoaiSanPham_DELETE = (req, res, next) => {
    const ID_LSP = req.params.lsp_id;
    LoaiSanPham.destroy({
        where: {ID_LSP: ID_LSP}
    })
    .then(number => {
        if (number == 1){
            next(responser.getDeleteRespone({ message: 'Xóa loại sản phẩm thành công'}));
        }
        else{
            next(responser.getErrorRespone({ statusCode: 400, err: 'Database deletion failed'}));
        }  
    })
    .catch(err => 
        next(responser.getErrorRespone({ err: err}))
    );
}