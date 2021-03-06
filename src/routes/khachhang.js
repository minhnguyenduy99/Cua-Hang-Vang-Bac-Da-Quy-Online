const khachhangController       = require('../controllers/khachhangController');
const sender                    = require('./response-sender');
const router                    = require('express').Router();
const { authorizator, idChecker }  = require('../config/access-control');

router.use(authorizator('khachhang'));

router.get('/view/:kh_id', idChecker('kh_id', 'idkh'), khachhangController.GetKhachHang_IDKH);
router.put('/update/:kh_id', idChecker('kh_id', 'idkh'), khachhangController.UpdateThongTinKhachHang_POST);
router.get('/view/phieumuahang/:kh_id', idChecker('kh_id', 'idkh'), khachhangController.GetAllPhieuMuaHang_IDKH_GET);

router.use((req, res, next) => {
    sender.send(res, req.result);
})

module.exports = router;