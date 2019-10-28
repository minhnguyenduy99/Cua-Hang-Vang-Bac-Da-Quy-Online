const imageUploader = require('../../middlewares/file-uploader').imageUploader;
const dataMapping = require('../../middlewares/data-mapping');
const sanphamController = require('../../controllers/sanPhamController');

const sanphamFolder = 'sanpham';
const field = 'sp_anhdaidien';

const router = require('express').Router();

router.post('/', 
    imageUploader(sanphamFolder, field).single(field), 
    dataMapping.Mapping_SanPham, 
    sanphamController.ThemSanPham_POST, 
    (result, req, res, next) => {
        if (result.err){
            require('fs').unlink(req.file.filename, err => {
                console.log(err);
            })
            return res.status(result.statusCode).json(result);
        }
        return res.status(result.statusCode).json({
            message: result.message,
            data: result.data.IDSanPham
        })
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