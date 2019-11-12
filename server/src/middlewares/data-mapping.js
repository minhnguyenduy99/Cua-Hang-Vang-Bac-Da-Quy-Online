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
        ID_LSP: req.body.lsp_id,
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
        Account_ID: req.body.account_id || null
    }
    req.body.khachHang = khachHang;
    next();
}

exports.Mapping_NhanVien = (req, res, next) => {
    const nhanVien = {
        HoTen: req.body.nv_ten,
        CMND: req.body.nv_cmnd,
        NgaySinh: req.body.nv_ngaysinh,
        GioiTinh: req.body.nv_gioitinh,
        SDT: req.body.nv_sdt,
        DiaChi: req.body.nv_diachi,
        NgayVaoLam: req.body.nv_ngayvaolam,
        AnhDaiDien: req.body.nv_anhdaidien,
        Account_ID: req.body.account_id,
        ID_LNV: req.body.id_lnv
    }
    req.body.nhanVien = nhanVien;
    next();
}

exports.Mapping_HoaDon = (req, res, next) => {
    const hoaDon = {
        ID_NV: req.body.id_nv,
        ID_KH: req.body.id_kh,
        GhiChu: req.body.hd_ghichu
    }
    req.body.hoaDon = hoaDon;
    next();
}