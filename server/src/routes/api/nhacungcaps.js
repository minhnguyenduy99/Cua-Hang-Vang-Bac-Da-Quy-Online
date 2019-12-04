// module import
const imageUploader     = require('../../middlewares/file-uploader').imageUploader;
const router            = require('express').Router();
const controller        = require('../../controllers/nhacungcapController');
const sender            = require('./response-sender');

const imageField  = 'anhdaidien';
const uploader = imageUploader('nhacungcap', imageField).single(imageField);

router.post('/register', 
    uploader, 
    controller.RegisterNhaCungCap_POST, 
    (req, res, next) => {
    sender.send(res, req.result);
})

router.post('/:nhacc_id/update', 
    uploader, 
    controller.UpdateNhaCungCap_POST, 
    (req, res, next) => {
        sender.send(res, req.result);
    }
)

router.get('/', controller.GetAllNhaCungCap_GET, (req, res, next) => {
    sender.send(res, req.result);
})

router.get('/:nhacc_id', controller.GetNhaCungCap_ByID_GET, (req, res, next) => {
    sender.send(res, req.result);
})

router.get('/:nhacc_id/phieunhapkho', controller.GetAllPhieuNhapKho_GET, (req, res, next) => {
    sender.send(res, req.result);
})

router.get('/:nhacc_id/sanphams', controller.GetAllSanPham_ByID_GET, (req, res, next) => {
    sender.send(res, req.result);
})

module.exports = router;
