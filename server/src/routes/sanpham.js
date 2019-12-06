const sanphamController     = require('../controllers/sanPhamController');
const { imageUploader }     = require('../middlewares/file-uploader');
const { authorizator }         = require('../config/access-control');
const router                = require('express').Router();
const sender                = require('./response-sender');

const imageField    = 'anhdaidien';
const formParser    = imageUploader('sanpham', imageField).single(imageField);

// no authorization needed
router.get('/', sanphamController.GetToanBoSanPham_GET);
router.get('/sp/:sp_id', sanphamController.GetSanPham_ByID);
router.get('/timkiem', sanphamController.GetSanPham_BySearch_GET);

// authorization required
router.post('/',              authorizator(), formParser, sanphamController.ThemSanPham_POST);
router.get('/deleted',        authorizator(null, 'get_deleted'), sanphamController.GetDeletedSanPham_GET);
router.get('/:sp_id/restore', authorizator(null, 'restore'), sanphamController.RestoreSanPham_GET);
router.delete('/:sp_id',      authorizator(), sanphamController.XoaSanPham_DELETE);
router.put('/:sp_id',         authorizator(), formParser, sanphamController.UpdateSanPham_PUT);

router.use((req, res, next) => {
    sender.send(res, req.result);
})

module.exports = router;