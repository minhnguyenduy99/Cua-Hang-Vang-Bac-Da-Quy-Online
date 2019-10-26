const Account = require('../models/Account');
const jwt = require('jsonwebtoken');
const config = require('../config/serverConfig'); 

exports.GetAllAccounts_GET = (req, res, next) => {
    Account.findAll({
        attributes: ['id', 'username']
    })
    .then(listAccounts => {
        res.status(200).json({
            account_count: listAccounts.length,
            account_list: listAccounts
        })
    })
    .catch(err => {
        res.status(500).json(err);
    })
}

exports.GetAccount_GET = (req, res, next) => {
    Account.findOne({
        attributes: ['id', 'username'],
        where: {id: req.params.Account_id},
    })
    .then(account => {
        if (account){
            res.status(200).json(account);
        }
        else{
            res.status(200).json({
                message: 'account not found'
            })
        }
    })
    .catch(err => {
        res.status(500).json(err)
    });
}

exports.Login_POST = (req, res, next) => {
    const {username, password} = req.body;
    
    Account.findOne({
        where: {username: username},
    })
    .then(account => {
        if (account && account.isPasswordCorrect(password)){
            res.status(200).json({
                account_id: account.id,
                message: 'Login successfully'
            })
        }
        else{
            res.status(200).json({
                message: 'The Accountname or password is incorrect'
            })
        }
    })
    .catch(err => {
        res.status(500).json(err);
    })
}

exports.RegisterNewAccount_POST = (req, res, next) => {
    const {username, password} = req.body;

    if (!(username && password)){
        res.status(200).json({
            message: 'Create new Account failed'
        })
    }
    else{
        Account.register(username, password)
        .then(account => {
            if (account){
                res.status(201).json({
                    account_id: account.id,
                    message: 'Register new account successfully'
                })
            }
            else{
                res.status(200).json({
                    mesage: 'Create new account failed'
                })
            }
        })
        .catch(err => res.status(500).json(err));
    }
}

exports.DeleteAccount_POST = (req, res, next) => {
    const AccountID = req.params.Account_id;
    Account.destroy({
        where: {id: AccountID}
    })
    .then(number => {
        if (number == 0){
            res.status(200).json({
                message: 'No account found'
            })
        }
        else{
            res.status(200).json({
                message: 'Account deleted!'
            })
        }
    })
    .catch(err => {
        res.status(500).json(err);
    })
}






