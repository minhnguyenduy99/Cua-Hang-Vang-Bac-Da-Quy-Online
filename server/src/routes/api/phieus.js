const controller        = require('../../controllers/phieuController');            
const sender            = require('./response-sender');
const router            = require('express').Router();

router.post('/create/:idloaiphieu', controller.CreateNewphieu_POST, (req, res, next) => {
    sender.send(res, req.result);
})

router.get('/', controller.GetAllPhieu_GET, (req, res, next) => {
    sender.send(res, req.result);
})

router.get('/:idloaiphieu/', controller.GetPhieuByLoaiPhieu_GET, (req, res, next) => {
    sender.send(res, req.result);
})

module.exports = router;