const mwSession = require('../middlewares/session');
const userAuthen = require('../middlewares/userAuthentication');
const express = require('express');
const router = express.Router();


router.post('/', (req, res, next) => {
    res.status(200).json({
        message: 'Log out'
    })
})

module.exports = router;