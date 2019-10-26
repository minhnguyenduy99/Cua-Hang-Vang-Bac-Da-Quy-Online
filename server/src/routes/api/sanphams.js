const imageUploader = require('../../middlewares/file-uploader').productImageUploader;
const dataMapping = require('../../middlewares/data-mapping');
const sanphamController = require('../../controllers/sanPhamController');


const router = require('express').Router();

router.post('/', imageUploader('sp_anhdaidien').single('sp_anhdaidien'), dataMapping.Mapping_SanPham, sanphamController.ThemSanPham_POST);

router.get('/', sanphamController.GetSanPham_GET);

router.delete('/:sanpham_id', sanphamController.XoaSanPham_DELETE);

module.exports = router;