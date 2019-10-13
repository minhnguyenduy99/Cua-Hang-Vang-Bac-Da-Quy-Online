const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../../config');

exports.all_users_retrieve_get = (req, res, next) => {
    
    User.findAll()
    .exec()
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
    .exec()
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
    .exec()
    .then(results => {
        // no result found
        if (results.length == 0){
            res.status(200).json({
                message: 'Username or password is incorrect'
            })
        }
        else{
            bcrypt.compare(password, results[0].password, (err, same) => {
                if (same){
                    const token = jwt.sign(results[0], config.TOKEN_PRIVATE_KEY);
                    res.status(200).json({
                        message: 'Login successfully',
                        token: token
                    })
                }
                else{
                    res.status(200).json({
                        message: 'Username or password is incorrect'
                    })
                }
            })
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

        User.insert(newUser)
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







