const express       = require('express');
const router        = express.Router();
const passport      = require('passport');
const sender        = require('./response-sender');
const accesser      = require('../config/access-control');

const { acl, getMappingRole } = accesser;

function authenticateCallBack(req, res, next){
    if (req.isAuthenticated()){
        req.taikhoan = req.user;
        next('route');
        return;
    }
    passport.authenticate(req.authname, (err, taikhoan, info) => {
        if (err){
            return next(err);
        }
        if (!taikhoan){
            return sender.authenticated(res, {valid: false, data: null})
        }
        if (req.body.nhomatkhau){
            req.logIn(taikhoan, err => {
                if (err){
                    next(err);
                    return;
                }
            })    
        }
        req.taikhoan = taikhoan;
        next();
    })(req, res, next);
}


async function addRoleToTaiKhoan(req, res, next){
    const taikhoan = req.taikhoan;
    await acl.addUserRoles(taikhoan.idtk, getMappingRole(taikhoan.loaitk));
    next();
}

router.get('/', (req, res) => {
    // load login resources here
    res.status(200).json({
        message: 'Login in this route'
    })
})

router.post('/khachhang', (req, res, next) => {
    req.authname = 'khachhang-login';
    next();
}, authenticateCallBack, addRoleToTaiKhoan);

router.post('/nhanvien', (req, res, next) => {
    req.authname = 'nhanvien-login';
    next();
}, authenticateCallBack, addRoleToTaiKhoan);

router.use((req, res, next) => {
    sender.authenticated(res, { valid: true, taikhoan: req.taikhoan });
})

module.exports = router;
