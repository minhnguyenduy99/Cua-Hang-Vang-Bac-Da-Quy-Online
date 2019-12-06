const khachhang   = require('./khachhang');
const nhansu      = require('./nhansu');
const sender      = require('../response-sender');
const router      = require('express').Router();
const { authorizator, firstTimeAuthorized } = require('../../config/access-control'); 

// authorize 
router.use(firstTimeAuthorized);
router.use(authorizator());

khachhang(router);
nhansu(router);

router.use((req, res, next) => {
    sender.send(res, req.result);
})


module.exports = router;