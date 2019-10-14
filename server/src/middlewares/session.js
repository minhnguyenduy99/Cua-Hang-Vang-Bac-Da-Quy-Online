const session = require('express-session');

exports.session_config = (req, res, next) => {
    session({
        secret: 'user_session',
        resave: true,
        saveUninitialized: false,
    })
    next();
}

exports.session_checker = (req, res, next) => {
    if (req.session.user_id){
        next();
    }
    next();
}

exports.user_session_create = (req, res, next) => {
    if (req.loginInfo.user_id && req.body.remember){
        req.session.user_id = req.loginInfo.user_id;
        req.session.created = true;
    }
    else{
        req.session.created = false;
    }
    next();
}

exports.user_session_destroy = (req, res, next) => {
    req.session.destroy(err => {
        if (err){
            console.log(err);
        }
    })
    next();
}

