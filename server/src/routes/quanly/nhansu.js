const nhanvienController    = require('../../controllers/nhanvienController');
const { imageUploader }     = require('../../middlewares/file-uploader');

const imageField = 'anhdaidien';
const formParser    = imageUploader('NhanVien', imageField).single(imageField);

module.exports = (router) => {
    
    router.post('/nhanvien', formParser, nhanvienController.CreateNewNhanVien_POST);
    
    router.get('/nhanvien', nhanvienController.GetAllNhanVien_GET);
    
    router.put('/nhanvien/:nv_id', formParser, nhanvienController.UpdateThongTinNhanVien_POST);
    
    router.delete('/nhanvien/:nv_id', nhanvienController.XoaNhanVien_DELETE);
}