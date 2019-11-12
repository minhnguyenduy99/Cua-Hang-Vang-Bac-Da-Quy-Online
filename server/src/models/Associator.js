const sequelize = require('./DBInterface').getSequelizeInstance;

const Account = require('./Account');
const KhachHang = require('./KhachHang');
const LoaiNhanVien = require('./LoaiNhanVien');
const NhanVien = require('./NhanVien');
const LoaiSanPham = require('./LoaiSanPham');
const SanPham = require('./SanPham');
const HoaDon = require('./HoaDon');
const ChiTietHoaDon = require('./ChiTietHoaDon');

module.exports = class ModelAssociator{
    static Account_KhachHang(){
        Account.hasOne(KhachHang, {
            foreignKey: {
                name: 'Account_ID',
                allowNull: true
            }
        })
    }
    
    static Account_NhanVien(){
        Account.hasOne(NhanVien, {
            foreignKey: {
                name: 'Account_ID',
                allowNull: true
            }
        })
    }
    
    static SanPham_LoaiSanPham(){
        SanPham.belongsTo(LoaiSanPham, {
            foreignKey: {
                name: 'ID_LSP',
                allowNull: false,
            }
        })
        LoaiSanPham.hasMany(SanPham, {
            foreignKey: {
                name: 'ID_LSP',
                allowNull: false
            }
        });
    }
    
    static NhanVien_LoaiNhanVien(){
        LoaiNhanVien.hasMany(NhanVien, {
            foreignKey: {
                name: 'ID_LNV',
                allowNull: false
            }
        });
    }
    
    static HoaDon_NhanVien(){
        HoaDon.belongsTo(NhanVien, {
            foreignKey: {
                name: 'ID_NV',
                allowNull: false
            }
        })
        NhanVien.hasMany(HoaDon, {
            foreignKey: {
                name: 'ID_NV',
                allowNull: false
            }
        });
    }
    
    static HoaDon_KhachHang(){
        HoaDon.belongsTo(KhachHang, {
            foreignKey: 'ID_KH',
            allowNull: false
        })
        KhachHang.hasMany(HoaDon, {
            foreignKey: {
                name: 'ID_KH',
                allowNull: false
            }
        });
    }
    
    static HoaDon_SanPham(){
        HoaDon.belongsToMany(SanPham, { 
            through: ChiTietHoaDon,
            as: 'listSanPham',
            foreignKey: 'ID_HD',
        });
        SanPham.belongsToMany(HoaDon, { 
            through: ChiTietHoaDon, 
            foreignKey: 'ID_SP',
        });
    }

    static associateAll(){
        this.Account_KhachHang();
        this.Account_NhanVien();
        this.NhanVien_LoaiNhanVien();
        this.SanPham_LoaiSanPham();
        this.HoaDon_KhachHang();
        this.HoaDon_NhanVien();
        this.HoaDon_SanPham();
    }
}
