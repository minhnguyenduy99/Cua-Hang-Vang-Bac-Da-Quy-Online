const mwSession = require('../middlewares/session');
const userAuthen = require('../middlewares/userAuthentication');
const express = require('express');
const router = express.Router();


router.post('/', mwSession.user_session_destroy, (req, res, next) => {
    res.redirect('/');
})

module.exports = router;