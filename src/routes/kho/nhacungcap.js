const nccController         = require('../../controllers/nhacungcapController');
const { imageUploader }     = require('../../middlewares/file-uploader');

module.exports = (router) => {
    router.post('/nhacungcap', nccController.RegisterBulkNhaCC_POST);

    router.get('/nhacungcap', nccController.GetAllNhaCungCap_GET);
    
    router.get('/nhacungcap/:nhacc_id', nccController.GetNhaCungCap_ByID_GET);

    router.get('/nhacungcap/:nhacc_id/phieunhapkho', nccController.GetAllPhieuNhapKho_GET);

    router.get('/nhacungcap/:nhacc_id/sanpham', nccController.GetAllSanPham_ByID_GET);

    router.put('/nhacungcap/:nhacc_id/', nccController.UpdateNhaCungCap_PUT);
}