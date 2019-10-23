const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../../config'); 

exports.GetAllUsers_GET = (req, res, next) => {
    User.findAll({
        attributes: ['id', 'username']
    })
    .then(users => {
        res.status(200).json({
            user_count: users.length,
            users: users
        })
    })
    .catch(err => {
        res.status(500).json(err);
    })
}

exports.GetUser_GET = (req, res, next) => {
    User.findOne({
        attributes: ['id', 'username'],
        where: {id: req.params.user_id},
    })
    .then(user => {
        if (user){
            res.status(200).json(user);
        }
        else{
            res.status(200).json({
                message: 'User not found'
            })
        }
    })
    .catch(err => {
        res.status(500).json(err)
    });
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

exports.DeleteUser_POST = (req, res, next) => {
    const userID = req.params.user_id;
    User.destroy({
        where: {id: userID}
    })
    .then(number => {
        if (number == 0){
            res.status(200).json({
                message: 'No user found'
            })
        }
        else{
            res.status(200).json({
                message: 'User deleted!'
            })
        }
    })
    .catch(err => {
        res.status(500).json(err);
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







