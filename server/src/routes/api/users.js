const express = require('express');
const router = express.Router();

const userController = require('../../controllers/userController');


router.get('/', userController.all_users_retrieve_get);

router.get('/:userID', userController.user_retrieve_get);

router.post('/register', userController.user_register_post);

router.post('/login', userController.user_login_post);


module.exports = router;