const express = require('express');
const router = express.Router();
const passport = require('passport');
const sender = require('./api/response-sender');

router.get('/', (req, res) => {
    // load login resources here
    res.status(200).json({
        message: 'Login in this route'
    })
})

router.post('/', (req, res, next) => {
    passport.authenticate('account-login', (err, user, info) => {
        if (err){
            return next(err);
        }
        if (!user){
            sender.authenticated(res, info.message);
        }
        if (req.body.remember){
            req.logIn(user, err => {
                if (err){
                    return next(err);
                }
                sender.authenticated(res, {
                    message: info.message,
                    data: {
                        session_saved: true,
                        user_id: user.id
                    }
                })
            })
        }
        else{
            sender.authenticated(res, {
                message: info.message,
                data: {
                    session_saved: false,
                    user_id: user.id
                }
            })
        }
    })(req, res, next);
});


module.exports = router;
