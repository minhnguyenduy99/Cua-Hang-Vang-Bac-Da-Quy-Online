const LoaiSanPham = require('../models/LoaiSanPham');
const router = require('express').Router();


module.exports.CreateNewLoaiSanPham_POST = (req, res) => {
    const tenLSP = req.body.lsp_ten;
    LoaiSanPham.create({ TenLSP: tenLSP})
    .then(newLSP => {
        if (newLSP){
            res.status(201).json({
                message: 'Tạo loại sản phẩm mới thành công'
            })
        }
        else{
            res.status(200).json({
                message: 'Tạo loại sản phẩm mới thất bại'
            })
        }
    })
    .catch(err => {
        res.status(500).json(err);
    })
}

module.exports.GetAllLoaiSanPham_GET = (req, res) => {
    LoaiSanPham.findAll()
    .then(listLSP => {
        res.status(200).json({
            lsp_count: listLSP.length,
            lsp_list: listLSP
        })
    })
}

module.exports.DeleteLoaiSanPham_DELETE = (req, res) => {
    const ID_LSP = req.params.lsp_id;
    LoaiSanPham.destroy({
        where: {ID_LSP: ID_LSP}
    })
    .then(number => {
        if (number == 1){
            res.status(200).json({
                message: 'Xóa loại sản phẩm thành công'
            })
        }
        else{
            res.status(200).json({
                request_id: ID_LSP,
                message: 'Không tìm thấy loại sản phẩm tương ứng'
            })
        }
    })
}