const nhacungcap    = require('./nhacungcap');
const phieu         = require('./phieu');
const sender        = require('../response-sender');
const router        = require('express').Router();
const { authorizator } = require('../../config/access-control'); 

// authorize 
router.use(authorizator());

nhacungcap(router);
phieu(router);

router.use((req, res, next) => {
    sender.send(res, req.result);
})

module.exports = router;