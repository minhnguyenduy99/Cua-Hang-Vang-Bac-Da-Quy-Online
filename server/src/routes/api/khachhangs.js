const khachhangController = require('../../controllers/khachhangController');
const sender              = require('./response-sender');
const router              = require('express').Router();
const uploader            = require('../../middlewares/file-uploader').imageUploader;

const field = 'anhdaidien';

router.post('/:kh_id/update', 
    uploader('khachhang', field).single(field),
    khachhangController.UpdateThongTinKhachHang_POST, 
    (req, res, next) => {
    sender.send(res, req.result);
})

router.get('/', khachhangController.GetAllKhachHang_GET, (req, res, next) => {
    sender.send(res, req.result);
});

router.get('/:kh_id', khachhangController.GetKhachHang_IDKH, (req, res, next) => {
    sender.send(res, req.result);
})

router.get('/:kh_id/phieus/:id_loaiphieu', khachhangController.GetAllPhieuMuaHang_IDKH_GET, (req, res, next) => {
    sender.send(res, req.result);
})

router.post('/register', 
    uploader('khachhang', field).single(field), 
    khachhangController.CreateNewKhachHang_POST,
    (req, res, next) => {
        sender.send(res, req.result);
    }
);


module.exports = router;