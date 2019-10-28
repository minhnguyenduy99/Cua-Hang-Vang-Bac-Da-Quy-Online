const Account = require('../models/Account');
const responser = require('./baseController');
const jwt = require('jsonwebtoken');
const config = require('../config/serverConfig'); 

exports.GetAllAccounts_GET = (req, res, next) => {
    Account.findAll({
        attributes: ['id', 'username']
    })
    .then(listAccounts => {
        next(responser.getRetrieveRespone({ data: listAccounts }));
    })
    .catch(err => {
        next(responser.getErrorRespone({ err: err }));
    })
}

exports.GetAccount_GET = (req, res, next) => {
    Account.findOne({
        attributes: ['id', 'username'],
        where: {id: req.params.Account_id},
    })
    .then(account => {
        if (account){
            next(responser.getRetrieveRespone({ data: account }));
        }
        else{
            next(responser.getErrorRespone({ err: 'Không tìm thấy tài khoản' }));
        }
    })
    .catch(err => {
        next(responser.getErrorRespone({ err: err }));
    });
}

exports.RegisterNewAccount_POST = (req, res, next) => {
    const {username, password} = req.body;

    if (!(username && password)){
        next(responser.getErrorRespone({ err: 'Tài khoản hoặc mật khẩu không hợp lệ' }));
    }
    else{
        Account.register(username, password)
        .then(result => {
            var statusCode = 200;
            if (result.account)
                statusCode = 201;
            next(responser.getRetrieveRespone({ statusCode: statusCode, data: result.account, message: result.message }));
        })
        .catch(err => responser.getErrorRespone({ err: err }));
    }
}

exports.DeleteAccount_POST = (req, res, next) => {
    const accountID = req.params.account_id;
    Account.destroy({
        where: {id: accountID}
    })
    .then(number => {
        if (number == 0){
            next(responser.getErrorRespone({ statusCode: 400, err: 'Không tìm thấy tài khoản' }));
        }
        else{
            next(responser.getDeleteRespone({ message: 'Xóa tài khoản thành công' }));
        }
    })
    .catch(err => {
        next(responser.getErrorRespone({ err: err }));
    })
}






