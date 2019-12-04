const nhanvienController    = require('../../controllers/nhanvienController');
const router                = require('express').Router();
const uploader              = require('../../middlewares/file-uploader').imageUploader;
const sender                = require('./response-sender');

const field                 = 'anhdaidien';

router.get('/', nhanvienController.GetAllNhanVien_GET, (req, res, next) => {
    sender.send(res, req.result);
});

router.get('/:nv_id', nhanvienController.GetNhanVien_IDNV, (req, res, next) => {
    sender.send(res, req.result);
})

router.post('/register', 
    uploader('nhanvien', field).single(field), 
    nhanvienController.CreateNewNhanVien_POST,
    (req, res, next) => {
        sender.send(res, req.result);
    }
);

router.post('/:nv_id/update',
    uploader('nhanvien', field).single(field),
    nhanvienController.UpdateThongTinNhanVien_POST, (req, res, next) => {
    sender.send(res, req.result);
})

router.get('/:nv_id/thongtinluongs', nhanvienController.GetThongTinLuong_GET, (req, res, next) => {
    sender.send(res, req.result);
})



module.exports = router;