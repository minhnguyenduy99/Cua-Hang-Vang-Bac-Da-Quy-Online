const LNVController = require('../../controllers/loainhanvienController');
const router = require('express').Router();
const sender = require('./response-sender');

router.get('/', LNVController.GetAllLoaiNhanVien_GET, (result, req, res ,next) => {
    return sender.get(res, result);
})

router.post('/register', LNVController.CreateNewLoaiNhanVien_POST, (result, req, res, next) => {
    return sender.created(res, result);
})

router.delete('/:id_lnv', LNVController.DeleteLoaiNhanVien_DELETE, (result, req, res, next) => {
    return sender.delete(res, result);
})

module.exports = router;