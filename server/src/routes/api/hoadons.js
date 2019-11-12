const hoadonController = require('../../controllers/hoadonController');
const HoaDon_Mapper = require('../../middlewares/data-mapping').Mapping_HoaDon;
const sender = require('./response-sender');
const router = require('express').Router();

router.post('/create', HoaDon_Mapper, hoadonController.CreateNewHoaDon_POST, (result, req, res, next) => {
    return sender.created(res, result);
})

router.get('/', hoadonController.GetAllHoaDon_GET, (result, req, res, next) => {
    return sender.get(res, result);
})

module.exports = router;