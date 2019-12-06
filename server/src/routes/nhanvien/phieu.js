const phieuController       = require('../../controllers/phieuController');

module.exports = (router) => {
    router.post('/phieu/:idloaiphieu', phieuController.CreateNewphieu_POST);

    router.get('/phieu/:idloaiphieu', phieuController.GetPhieuByLoaiPhieu_GET);
}