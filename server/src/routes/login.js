const express       = require('express');
const router        = express.Router();
const passport      = require('passport');
const sender        = require('./api/response-sender');
const ErrorHandler  = require('../middlewares/error-handler').ErrorHandler;
const accesser      = require('../config/access-control');

const { acl, getMappingRole } = accesser;


router.get('/', (req, res) => {
    // load login resources here
    res.status(200).json({
        message: 'Login in this route'
    })
})

router.post('/', (req, res, next) => {
    passport.authenticate('user-login', (err, taikhoan, info) => {
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
        acl.addUserRoles(taikhoan.idtk, getMappingRole(taikhoan.loaitk));
        return sender.authenticated(res, {data: taikhoan})
    })(req, res, next);
});


module.exports = router;
