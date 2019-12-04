const LocalStrategy = require('passport-local').Strategy;

const TaiKhoan = require('../models/TaiKhoan');

module.exports = (passport) => {

    passport.use('user-login', new LocalStrategy(
        {
            usernameField: 'tendangnhap',
            passwordField: 'matkhau',
        },
        (tendangnhap, matkhau, done) => {
            TaiKhoan.authenticate(tendangnhap, matkhau)
            .then(taikhoan => {
                return done(null, taikhoan)
            })
            .catch(err => done(err));
        }
    ))

    passport.serializeUser((taikhoan, done) => {
        done(null, taikhoan.idtk);
    })

    passport.deserializeUser((id, done) => {
        TaiKhoan.findOne({
            where: {idtk: id},
        })
        .then(taikhoan => {
            done(null, taikhoan);
        })
    })
}