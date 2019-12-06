const nccController         = require('../../controllers/nhacungcapController');
const { imageUploader }     = require('../../middlewares/file-uploader');

const imageField    = 'anhdaidien';
const formParser    = imageUploader('nhacungcap', imageField).single(imageField);

module.exports = (router) => {
    router.post('/nhacungcap', formParser, nccController.RegisterNhaCungCap_POST);

    router.get('/nhacungcap', nccController.GetAllNhaCungCap_GET);
    
    router.get('/nhacungcap/:nhacc_id', nccController.GetNhaCungCap_ByID_GET);

    router.get('/nhacungcap/:nhacc_id/sanpham', nccController.GetAllSanPham_ByID_GET);

    router.put('/nhacungcap/:nhacc_id/', formParser, nccController.UpdateNhaCungCap_PUT);
}