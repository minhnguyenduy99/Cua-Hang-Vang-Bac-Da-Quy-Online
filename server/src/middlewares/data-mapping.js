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
        GhiChu: req.body.sp_ghichu,
        ID_LSP: req.body.lsp_id
    }
    req.body.sanPham = sanPham;
    next();
}

exports.Mapping_KhachHang = (req, res, next) => {
    const khachHang = {
        TenKH: req.body.kh_ten,
        CMND: req.body.kh_cmnd,
        NgaySinh: req.body.kh_ngaysinh,
        GioiTinh: req.body.kh_gioitinh,
        SDT: req.body.kh_sdt,
        DiaChi: req.body.kh_diachi,
        AnhDaiDien: req.body.kh_anhdaidien,
        Account_ID: req.body.account_id ? req.body.account_id : null
    }
    req.body.khachHang = khachHang;
    next();
}