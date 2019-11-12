const nhanvienController = require('../../controllers/nhanvienController');
const router = require('express').Router();
const dataMapping = require('../../middlewares/data-mapping');
const uploader = require('../../middlewares/file-uploader').imageUploader;
const sender = require('./response-sender');
const storeImageDir = 'nhanvien';
const field = 'nv_anhdaidien';

router.get('/', nhanvienController.GetAllNhanVien_GET, (result, req, res, next) => {
    return sender.get(res, result);
});

router.get('/:id_nv', nhanvienController.GetNhanVien_GET, (result, req, res, next) => {
    return sender.get(res, result);
})

router.post('/register', 
    uploader(storeImageDir, field).single(field), 
    dataMapping.Mapping_NhanVien, 
    nhanvienController.CreateNewNhanVien_POST,
    (result, req, res, next) => {
        if (result.err){
            require('fs').unlink(req.file.path, err => {
                console.log(err);
            })
        }
        return sender.created(res, result);
    }
);

router.delete('/:nv_id', nhanvienController.DeleteNhanVien_DELETE, (result, req, res, next) => {
    return sender.delete(res, result);
});



module.exports = router;