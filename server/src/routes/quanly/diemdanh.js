const diemdanhController   = require('../../controllers/chitietdiemdanhController');

module.exports = (router) => {

    router.post('/diemdanh', diemdanhController.Create_POST);

    router.get('/diemdanh', diemdanhController.GetDiemDanh_GET);
}
