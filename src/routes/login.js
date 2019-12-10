const express       = require('express');
const router        = express.Router();
const passport      = require('passport');
const sender        = require('./response-sender');
const accesser      = require('../config/access-control');

const { acl, getMappingRole } = accesser;

function authenticateCallBack(req, res, next){
    passport.authenticate(req.authname, async (err, taikhoan, info) => {
        if (err){
            return next(err);
        }
        if (!taikhoan){
            return sender.authenticated(res, {valid: false, data: null})
        }
        await req.logIn(taikhoan, err => {
            console.log('LogIn');
            if (err){
                next(err);
                return;
            }
        })    
        req.taikhoan = taikhoan;

        await addRoleToTaiKhoan(req, res, next);
        console.log('AddRole');
        
        next();
    })(req, res, next);
}


async function addRoleToTaiKhoan(req, res, next){
    const taikhoan = req.taikhoan;
    await acl.addUserRoles(taikhoan.idtk, getMappingRole(taikhoan.loaitk));
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
}, authenticateCallBack);

router.post('/nhanvien', (req, res, next) => {
    req.authname = 'nhanvien-login';
    next();
}, authenticateCallBack);

router.use((req, res, next) => {
    sender.authenticated(res, { valid: true, data: req.taikhoan });
})

module.exports = router;
