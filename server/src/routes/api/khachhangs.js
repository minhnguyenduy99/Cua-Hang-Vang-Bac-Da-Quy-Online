const khachhangController = require('../../controllers/khachhangController');
const router = require('express').Router();
const dataMapping = require('../../middlewares/data-mapping');
const uploader = require('../../middlewares/file-uploader').imageUploader;
const khachhangFolder = 'khachhang';
const field = 'kh_anhdaidien';

router.get('/', khachhangController.GetAllKhachHang_GET, (result, req, res, next) => {
    if (result.err){
        return res.status(result.statusCode).json(result);
    }
    return res.status(result.statusCode).json(result.data);
});

router.post('/register', 
    uploader(khachhangFolder, field).single(field), 
    dataMapping.Mapping_KhachHang, 
    khachhangController.CreateNewKhachHang_POST,
    (result, req, res, next) => {
        if (result.err){
            
            require('fs').unlink(req.file.path, err => {
                console.log(err);
            })
            return res.status(result.statusCode).json(result);
        }
        res.status(result.statusCode).json({
            message: result.message,
            data: result.data
        })
    }
);

router.delete('/:kh_id', khachhangController.DeleteKhachHang_DELETE, (result, req, res, next) => {
    res.status(result.statusCode).json(result);  
});


module.exports = router;