const chitietdiemdanhController         = require('../controllers/chitietdiemdanhController');
const chitietluongController            = require('../controllers/chitietluongController');
const baocaoController                  = require('../controllers/baocaoController');
const sender                            = require('./api/response-sender');
const router                            = require('express').Router();


router.post('/diemdanh/create', chitietdiemdanhController.Create_POST, (req, res, next) => {
    sender.send(res, req.result);
})

router.get('/diemdanh/', chitietdiemdanhController.GetDiemDanh_GET, (req, res, next) => {
    sender.send(res, req.result);
})

router.post('/chitietluong/create', 
    chitietluongController.CreateChiTietLuongNhanVien_GET, 
    (req, res, next) => {
    sender.send(res, req.result);
})


router.get('/chitietluong/:nv_id', chitietluongController.GetChiTietLuongNhanVien_GET, (req, res, next) => {
    sender.send(res, req.result);
})

router.post('/baocaos/create', baocaoController.CreateBaoCao_POST, (req, res, next) => {
    sender.send(res, req.result);
})

router.get('/baocaos/', baocaoController.GetBaoCao_GET, (req, res, next) => {
    sender.send(res, req.result);
})

module.exports = router;