const nhanvienController    = require('../../controllers/nhanvienController');

module.exports = (router) => {
    
    router.post('/nhanvien', nhanvienController.CreateNewNhanVien_POST);
    
    router.get('/nhanvien', nhanvienController.GetAllNhanVien_GET);
    
    router.put('/nhanvien/:nv_id', nhanvienController.UpdateThongTinNhanVien_POST);
    
    router.delete('/nhanvien/:nv_id', nhanvienController.XoaNhanVien_DELETE);
}