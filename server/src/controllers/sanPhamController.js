const SanPham = require('../models/SanPham');

module.exports.GetToanBoSanPham_GET = (req, res) => {
    SanPham.findAll()
    .then(listSanPham => {
        res.status(200).json({
            count: listSanPham.length,
            list_SanPham: listSanPham
        })
    })
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
    // const sanPham = {
    //     Ten: req.body.sp_ten,
    //     GiaNhap: req.body.sp_gianhap,
    //     GiaBan: req.body.sp_giaban,
    //     GiaGiaCong: req.body.sp_giagiacong,
    //     GiaCam: req.body.sp_giacam,
    //     AnhDaiDien: req.body.sp_anhdaidien,
    //     TieuChuan: req.body.sp_tieuchuan,   
    //     KhoiLuong: req.body.sp_khoiluong,
    //     GhiChu: req.body.sp_ghichu
    // }
    SanPham.create(req.body.sanPham)
    .then(sanPham => {
        if (sanPham){
            res.status(201).json({
                message: 'Create new product successfully'
            })
        }
        else{
            res.status(200).json({
                message: 'Create product failed'
            })
        }
    })
    .catch(err => {
        res.status(500).json(err);
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
            .then(number => {
                if (number > 0){
                    res.status(200).json({
                        message: 'Delete product successfully'
                    })
                }
                else{
                    res.status(200).json({
                        message: 'Delete product failed'
                    })
                }
            })
        }
    })
}
