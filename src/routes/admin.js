const adminController           = require('../controllers/adminController');
const sender                    = require('./response-sender');
const router                    = require('express').Router();

router.post('/', adminController.CreateAdmin_POST);

router.use((req, res, next) => {
    sender.send(res, req.result);
})

module.exports = router;