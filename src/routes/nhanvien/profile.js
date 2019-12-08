const nhanvienController    = require('../../controllers/nhanvienController');
const { imageUploader }     = require('../../middlewares/file-uploader');
const { idChecker }         = require('../../config/access-control');

const imageField    = 'anhdaidien';
const formParser    = imageUploader('nhanvien', imageField).single(imageField);

module.exports = (router) => {
    
    router.get('/profile/:nv_id', idChecker('nv_id', 'idnv'), nhanvienController.GetNhanVien_IDNV);

    router.put('/profile/:nv_id', idChecker('nv_id', 'idnv'), formParser, nhanvienController.UpdateThongTinNhanVien_POST);
}