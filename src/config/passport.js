const LocalStrategy = require('passport-local').Strategy;

const KhachHang     = require('../models/KhachHang');
const NhanVien      = require('../models/NhanVien');

module.exports = (passport) => {

    passport.use('khachhang-login', new LocalStrategy(
        {
            usernameField: 'tendangnhap',
            passwordField: 'matkhau',
        },
        (tendangnhap, matkhau, done) => {
            KhachHang.authenticate(tendangnhap, matkhau)
            .then(khachhang => {
                return done(null, khachhang)
            })
            .catch(err => done(err));
        }
    ))

    passport.use('nhanvien-login', new LocalStrategy(
        {
            usernameField: 'tendangnhap',
            passwordField: 'matkhau',
        },
        (tendangnhap, matkhau, done) => {
            NhanVien.authenticate(tendangnhap, matkhau)
            .then(nhanvien => {
                return done(null, nhanvien)
            })
            .catch(err => done(err));
        }
    ))

    passport.serializeUser((taikhoan, done) => {
        done(null, taikhoan);
    })
    
    passport.deserializeUser((taikhoan, done) => {
        done(null, taikhoan);
    })
}
