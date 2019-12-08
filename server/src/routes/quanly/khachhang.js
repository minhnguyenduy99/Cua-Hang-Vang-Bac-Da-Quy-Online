const khachhangController   = require('../../controllers/khachhangController');

module.exports = (router) => {

    router.post('/khachhang', khachhangController.CreateNewKhachHang_POST);

    router.get('/khachhang', khachhangController.GetAllKhachHang_GET);

    router.put('/khachhang/:kh_id', khachhangController.UpdateThongTinKhachHang_POST);

    router.delete('/khachhang/:kh_id', khachhangController.DeleteKhachHang_DELETE);

    router.get('/khachhang/:kh_id/phieumuahang', khachhangController.GetAllPhieuMuaHang_IDKH_GET);
}