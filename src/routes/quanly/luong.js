const luongController   = require('../../controllers/chitietluongController');

module.exports = (router) => {

    router.post('/luong', luongController.CreateChiTietLuongNhanVien_POST);

    router.get('/luong', luongController.GetChiTietLuongNhanVien_GET);
}
