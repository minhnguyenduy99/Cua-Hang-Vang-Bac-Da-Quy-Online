const express = require('express');
const session = require('express-session');
const router = express.Router();
const userController = require('../controllers/userController');
const mwSession = require('../middlewares/session');


router.post('/', userController.Login_POST);


module.exports = router;
