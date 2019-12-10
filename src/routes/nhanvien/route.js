const phieu         = require('./phieu');
const profile       = require('./profile');
const sender        = require('../response-sender');
const router        = require('express').Router();
const { authorizator } = require('../../config/access-control'); 

// authorize 
router.use(authorizator());

profile(router);
phieu(router);


router.use((req, res, next) => {
    sender.send(res, req.result);
})

module.exports = router;