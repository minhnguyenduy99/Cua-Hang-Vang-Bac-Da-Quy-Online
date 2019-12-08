// middlewares for mapping the request fields with the data object of database

function GetTaiKhoanMapping(taikhoanObj){
    const taikhoan = {
        LoaiTK          : taikhoanObj.tk_loai,
        TenTK           : taikhoanObj.tk_tendangnhap,
        MatKhau         : taikhoanObj.tk_matkhau,
        HoTen           : taikhoanObj.tk_hoten,
        CMND            : taikhoanObj.tk_cmnd,
        NgaySinh        : taikhoanObj.tk_ngaysinh,
        GioiTinh        : taikhoanObj.tk_gioitinh,
        SDT             : taikhoanObj.tk_sdt,
        DiaChi          : taikhoanObj.tk_diachi,
        AnhDaiDien      : taikhoanObj.tk_anhdaidien,
        GhiChu          : taikhoanObj.tk_ghichu
    }
    return taikhoan;
}

exports.Mapping_KhachHang = (req, res, next) => {
    req.body.taikhoan = GetTaiKhoanMapping(req.body);
    req.body.taikhoan.khachhang = {};
    next();
}

exports.Mapping_NhanVien = (req, res, next) => {
    const taikhoan = GetTaiKhoanMapping(req.body);
    const nhanvien = req.body.nhan_vien;

    taikhoan.NhanVien = {
        IDQL            : nhanvien.nv_idql,
        ChucVu          : nhanvien.nv_chucvu,
        Luong           : nhanvien.nv_luong
    },

    req.body.taikhoan = taikhoan;
    next();
}

exports.Mapping_SanPham = (req, res, next) => {
    const sanpham = {
        Ten             : req.body.sp_ten,
        LoaiSP          : req.body.sp_loai,
        GiaNhap         : req.body.sp_gianhap,
        GiaBan          : req.body.sp_giaban,
        GiaGiaCong      : req.body.sp_giagiacong,
        GiaCam          : req.body.sp_giacam,
        AnhDaiDien      : req.body.sp_anhdaidien,
        TieuChuan       : req.body.sp_tieuchuan,   
        KhoiLuong       : req.body.sp_khoiluong,
        GhiChu          : req.body.sp_ghichu,
        IDNhaCC         : req.body.sp_nhacc
    }
    
    req.body.sanpham = sanpham;
    next();
}