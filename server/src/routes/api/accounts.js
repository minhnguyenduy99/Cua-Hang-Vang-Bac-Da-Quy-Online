const express = require('express');
const router = express.Router();

const accountController = require('../../controllers/accountController');


router.get('/', accountController.GetAllAccounts_GET);

router.get('/:account_id', accountController.GetAllAccounts_GET);

router.post('/register', accountController.RegisterNewAccount_POST);

router.post('/login', accountController.Login_POST);

router.delete('/:account_id', accountController.DeleteAccount_POST);


module.exports = router;