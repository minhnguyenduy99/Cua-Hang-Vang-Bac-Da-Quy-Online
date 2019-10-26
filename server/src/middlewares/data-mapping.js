// middlewares for mapping the request fields with the data object of database

exports.Mapping_SanPham = (req, res, next) => {
    const sanPham = {
        Ten: req.body.sp_ten,
        GiaNhap: req.body.sp_gianhap,
        GiaBan: req.body.sp_giaban,
        GiaGiaCong: req.body.sp_giagiacong,
        GiaCam: req.body.sp_giacam,
        AnhDaiDien: req.body.sp_anhdaidien,
        TieuChuan: req.body.sp_tieuchuan,   
        KhoiLuong: req.body.sp_khoiluong,
        GhiChu: req.body.sp_ghichu
    }
    req.body.sanPham = sanPham;
    next();
}