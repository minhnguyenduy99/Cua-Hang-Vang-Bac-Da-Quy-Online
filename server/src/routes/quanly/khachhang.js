const khachhangController   = require('../../controllers/khachhangController');
//const router                = require('express').Router();
const { imageUploader }     = require('../../middlewares/file-uploader');

const imageField = 'anhdaidien';
const formParser    = imageUploader('KhachHang', imageField).single(imageField);

module.exports = (router) => {

    router.post('/khachhang', formParser, khachhangController.CreateNewKhachHang_POST);

    router.get('/khachhang', khachhangController.GetAllKhachHang_GET);

    router.put('/khachhang/:kh_id', formParser, khachhangController.UpdateThongTinKhachHang_POST);

    router.delete('/khachhang/:kh_id', khachhangController.DeleteKhachHang_DELETE);

    router.get('/khachhang/:kh_id/phieumuahang', khachhangController.GetAllPhieuMuaHang_IDKH_GET);
}