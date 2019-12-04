const fs                    = require('fs');
const imageUploader         = require('../../middlewares/file-uploader').imageUploader;
const sanphamController     = require('../../controllers/sanPhamController');
const sender                = require('./response-sender');
const router                = require('express').Router();
const acl                   = require('../../config/access-control').acl;
const field = 'anhdaidien';

router.post('/register', 
    imageUploader('sanpham', field).single(field), 
    sanphamController.ThemSanPham_POST, 
    (req, res, next) => {
        sender.send(res, req.result);
    }
);

router.post('/:sp_id/update', 
    imageUploader('sanpham', field).single(field),
    sanphamController.UpdateSanPham_POST,
    (req, res, next) => {
        sender.send(res, req.result);
    }
)

router.get('/timkiem', sanphamController.GetSanPham_BySearch_GET, (req, res, next) => {
    sender.send(res, req.result);
})

router.get('/', sanphamController.GetToanBoSanPham_GET, (req, res, next) => {
    sender.send(res, req.result);
});

router.get('/deleted', sanphamController.GetDeletedSanPham_GET, (req, res, next) => {
    sender.send(res, req.result);
})

router.get('/:sp_id', sanphamController.GetSanPham_ByID, (req, res, next) => {
    sender.send(res, req.result);
})

router.get('/:sp_id/restore', sanphamController.RestoreSanPham_GET, (req, res, next) => {
    sender.send(res, req.result);
})

router.delete('/:sp_id', sanphamController.XoaSanPham_DELETE, (req, res, next) => {
    sender.send(res, req.result);
});

module.exports = router;