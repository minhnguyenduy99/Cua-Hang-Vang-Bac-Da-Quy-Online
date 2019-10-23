const express = require('express');
const router = express.Router();

const userController = require('../../controllers/userController');


router.get('/', userController.GetAllUsers_GET);

router.get('/:user_id', userController.GetUser_GET);

router.post('/register', userController.RegisterNewUser_POST);

router.post('/login', userController.Login_POST);

router.delete('/:user_id', userController.DeleteUser_POST);


module.exports = router;