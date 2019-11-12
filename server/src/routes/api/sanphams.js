const imageUploader = require('../../middlewares/file-uploader').imageUploader;
const dataMapping = require('../../middlewares/data-mapping');
const sanphamController = require('../../controllers/sanPhamController');
const serverStorageConfig = require('../../config/serverConfig').storage;
const sender = require('./response-sender');

const storeFolder = 'sanpham';
const field = 'sp_anhdaidien';

const router = require('express').Router();

router.post('/', 
    imageUploader(storeFolder, field).single(field), 
    dataMapping.Mapping_SanPham, 
    sanphamController.ThemSanPham_POST, 
    (result, req, res, next) => {
        if (result.err){
            require('fs').unlink(req.file.filename, err => {
                console.log(err);
            })
            return sender.error(res, result);
        }
        return sender.created(res, result);
    });

router.get('/', sanphamController.GetToanBoSanPham_GET, (result, req, res, next) => {
    if (result.err){
        return res.status(result.statusCode).json(result);
    }
    return res.status(result.statusCode).json(result.data);
});

router.delete('/:sanpham_id', sanphamController.XoaSanPham_DELETE, (result, req, res, next) => {
    res.status(result.statusCode).json(result);
});

module.exports = router;