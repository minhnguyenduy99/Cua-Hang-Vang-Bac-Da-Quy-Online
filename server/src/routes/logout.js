const express = require('express');
const router = express.Router();


router.post('/', (req, res, next) => {
    req.logOut();
    res.redirect('/login');
})

module.exports = router;