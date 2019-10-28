const passport = require('passport');
const express = require('express');
const router = express.Router();

const accountController = require('../../controllers/accountController');


router.get('/', accountController.GetAllAccounts_GET, (result, req, res, next) => {
    if (result.err){
        return res.status(result.statusCode).json(result);
    }
    return res.status(result.statusCode).json(result.data);
});

router.get('/:account_id', accountController.GetAllAccounts_GET, (result, req, res, next) => {
    return res.status(result.statusCode).json(result);
});

router.post('/register', accountController.RegisterNewAccount_POST, (result ,req, res, next) => {
    return res.status(result.statusCode).json(result);
});

router.delete('/:account_id', accountController.DeleteAccount_POST, (result, req, res, next) => {
    return res.status(result.statusCode).json(result);
});


module.exports = router;