const sequelize = require('./DBInterface').getSequelizeInstance();

const TaiKhoan      = require('./TaiKhoan');
const KhachHang     = require('./KhachHang');
const NhanVien      = require('./NhanVien');
const NhaCungCap    = require('./NhaCungCap');
const SanPham       = require('./SanPham');
const Phieu         = require('./Phieu');
const LoaiPhieu     = require('./LoaiPhieu');
const ChiTietPhieu  = require('./ChiTietPhieu');
const PhieuCamDo    = require('./PhieuCamDo');
const PhieuThuMua   = require('./PhieuThuMua');
const ChiTietPhieuMuaHang = require('./ChiTietPhieuMuaHang');
const CTPhieuCamDo  = require('./CTPhieuCamDo');

module.exports = class ModelAssociator{

    static TaiKhoan_KhachHang(){
    }
    
    static TaiKhoan_NhanVien(){
    }
    
    static NhanVien_QuanLy(){
    }

    static NhaCungCap_SanPham(){
    }

    static Phieu_LoaiPhieu(){
    }
    
    static Phieu_NhanVien(){
    }
    
    static Phieu_KhachHang(){
    }
    
    static Phieu_SanPham(){
    }

    static CTPhieu_SanPham(){
    }

    static CTPhieu_Phieu(){
    }

    static Phieu_PhieuCamDo(){
    }

    static Phieu_PhieuThuMua(){
    }

    static Phieu_ChiTietPhieuMuaHang(){
    }

    static CTPhieuMuaHang_SanPham(){
    }

    static Phieu_Associations(){
    }

    static associateAll(){
        //this.TaiKhoan_KhachHang();
        //this.TaiKhoan_NhanVien();
        //this.NhanVien_QuanLy();
        //this.NhaCungCap_SanPham();
        this.Phieu_LoaiPhieu();
        //this.Phieu_KhachHang();
        //this.Phieu_NhanVien();
        this.Phieu_SanPham();
        this.CTPhieu_Phieu();
        this.CTPhieu_SanPham();

        this.Phieu_PhieuCamDo();
        this.Phieu_PhieuThuMua();
        this.Phieu_ChiTietPhieuMuaHang();
        this.CTPhieuMuaHang_SanPham();

    }
}
