const express = require('express');
const router = express.Router();

const userController = require('../../controllers/userController');


router.get('/', userController.all_users_retrieve_get);

router.get('/:userID', userController.user_retrieve_get);

router.post('/register', userController.RegisterNewUser_POST);

router.post('/login', userController.Login_POST);

router.delete('/:userID', userController.user_delete);

module.exports = router;