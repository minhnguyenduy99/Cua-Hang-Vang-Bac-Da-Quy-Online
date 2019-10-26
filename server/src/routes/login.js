const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/', (req, res) => {
    // load login resources here
    res.status(200).json({
        message: 'Login in this route'
    })
})

router.post('/', (req, res, next) => {
    passport.authenticate('user-login', (err, user, info) => {
        if (err){
            return next(err);
        }
        if (!user){
            return res.status(200).json({
                message: info.message,
            })
        }
        if (req.body.remember){
            req.logIn(user, err => {
                if (err){
                    return next(err);
                }
                return res.status(200).json({
                    message: info.message,
                    user_id: user.id
                })
            })
        }
        return res.status(200).json({
            message: info.message,
            user_id: user.id
        })
    })(req, res, next);
});


module.exports = router;
