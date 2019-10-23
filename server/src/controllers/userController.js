const User = require('../models/User');
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

exports.Login_POST = (req, res, next) => {
    const {username, password} = req.body;
    
    User.findOne({
        where: {username: username},
    })
    .then(user => {
        if (user && user.isPasswordCorrect(password)){
            res.status(200).json({
                user_id: user.id,
                message: 'Login successfully'
            })
        }
        else{
            res.status(200).json({
                message: 'The username or password is incorrect'
            })
        }
    })
    .catch(err => {
        res.status(500).json(err);
    })
    
}

exports.RegisterNewUser_POST = (req, res, next) => {
    const {username, password} = req.body;

    if (!(username && password)){
        res.status(200).json({
            message: 'Create new user failed'
        })
    }
    else{
        User.findOne({
            where: {username: username}
        })
        .then(user => {
            if (user){
                res.status(200).json({
                    message: 'The username already exists'
                })
            }
            else{
                User.create({
                    username: username,
                    password: password
                })
                .then(user => {
                    if (user){
                        res.status(200).json({
                            user_id: user.id,
                            message: 'Create new user successfully'
                        })
                    }
                    else{
                        res.status(200).json({
                            message: 'Create new user failed'
                        })
                    }
                }) 
            }
        })
        .catch(err => {
            res.status(500).json(err);
        })
    }
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







