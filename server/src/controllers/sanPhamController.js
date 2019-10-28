const SanPham = require('../models/SanPham');
const responser = require('./baseController');

module.exports.GetToanBoSanPham_GET = (req, res, next) => {
    SanPham.findAll()
    .then(listSanPham => {
        next(responser.getRetrieveRespone({ data: listSanPham }));
    })
    .catch(err => 
        next(responser.getErrorRespone({ err: err }))
    );
}

module.exports.GetSanPham_GET = (req, res) => {
    const query = req.query;
    if (!query || !query.search){
        this.GetToanBoSanPham_GET(req, res);
    }
    else{
        const textSearch = query.search;
        SanPham.fullTextSearch(textSearch)
        .then(listSanPham => {
            res.status(200).json({
                count: listSanPham.length,
                list_sanPham: listSanPham
            })
        })
    }
}

module.exports.ThemSanPham_POST = (req, res, next) => {
    SanPham.create(req.body.sanPham)
    .then(sanPham => {
        if (sanPham){
            next(responser.getCreatedRespone({ data: sanPham, message: 'Tạo sản phẩm mới thành công' }));
        }
        else{
            next(responser.getErrorRespone({ err: 'Tạo sản phẩm thất bại' }));
        }
    })
    .catch(err => {
        next(responser.getErrorRespone({ err: err, data: null }));
    })
}

module.exports.XoaSanPham_DELETE = (req, res, next) => {
    const sanPhamID = req.params.sanpham_id;
    
    SanPham.findOne({
        where: {IDSanPham: sanPhamID}
    })
    .then(sanPham => {
        if (sanPham){
            sanPham.delete()
            .then(success => {
                next(responser.getDeleteRespone({ message: 'Xóa sản phẩm thành công'}));
            })
        }
        else{
            next(responser.getErrorRespone({ statusCode: 400, err: 'Không tìm thấy sản phẩm' }));
        }
    })
    .catch(err => {
        next(responser.getErrorRespone({ err: err }));
    })
}
