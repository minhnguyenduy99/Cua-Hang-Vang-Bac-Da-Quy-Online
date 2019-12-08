const express = require('express');
const router = express.Router();
const sender    = require('./response-sender');


router.get('/', (req, res, next) => {
    req.logOut();
    sender.send(res, { statusCode: 200, options: {message: 'LOG_OUT'}} );
})

module.exports = router;