const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../../config');

exports.all_users_retrieve_get = (req, res, next) => {
    
    User.findAll()
    .execSelect()
    .then(results => {
        res.status(200).json({
            count: results.length,
            users: results
        })
    })
    .catch(err => {
        res.status(500).json(err);
    })
}

exports.user_retrieve_get = (req, res, next) => {

    User.find({id: req.params.userID})
    .select('id username')
    .execSelect()
    .then(result => {
        res.status(200).json(result[0])
    })
    .catch(err => {
        res.status(500).json({
            err: err
        })
    })
}

exports.user_login_post = (req, res, next) => {

    const {username, password} = req.body;
    
    User.find({username: username})
    .execSelect()
    .then(results => {
        var loginInfo = {
            message: 'Username or password is incorrect',
            valid: false
        }
        // no result found
        if (results.length == 0){
            req.loginInfo = loginInfo;
            next();
        }
        else{
            if (results.length == 1){
                bcrypt.compare(password, results[0].password, (err, same) => {
                    if (same){
                        const token = jwt.sign(results[0], config.TOKEN_PRIVATE_KEY);
                        loginInfo = {
                            valid: true,
                            message: 'Login successfully',
                            user_id: results[0].id,
                            user_token: token
                        }
                    }
                    req.loginInfo = loginInfo;
                    next();
                })
            }
        }
    })
    .catch(err => {
        res.status(500).json(err);
    })
}

exports.user_register_post = (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (err, encrypted) => {
        const newUser = new User({
            username: req.body.username,
            password: encrypted
        })

        newUser.save()
        .then(results => {
            res.status(201).json({
                message: 'Create new user successfully'
            })
        })
        .catch(err => {
            res.status(500).json(err);
        })
    })
}

exports.user_delete = (req, res, next) => {
    const id = req.params.userID;

    User.delete({id: id})
    .then(result => {
        console.log(result);
        res.status(200).json({
            affectedCount: result.afftectedRows,
            message: 'Delete successfully'
        });
    })
    .catch(err => {
        res.status(500).json(err);
    })
}







