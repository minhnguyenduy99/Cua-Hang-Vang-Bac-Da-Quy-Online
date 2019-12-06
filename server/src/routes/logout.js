const express = require('express');
const router = express.Router();
const sender    = require('./response-sender');
const { ErrorHandler }  = require('../middlewares/error-handler');


router.use((req, res, next) => {
    // check weither the session for user exists
    if (req.user)
        next();
    else
        next(ErrorHandler.createError('unauthorized'));
})

router.get('/', (req, res, next) => {
    req.logOut();
    sender.send(res, { statusCode: 200, options: {message: 'LOG_OUT'}} );
})

module.exports = router;