const express = require('express');
const session = require('express-session');
const router = express.Router();
const userController = require('../controllers/userController');
const mwSession = require('../middlewares/session');

router.post('/', userController.user_login_post, mwSession.user_session_create, (req, res, next) => {
    if (req.session.created){
        res.status(200).json({
            sessionState: 'SAVE',
            session: req.session.user_id,
            info: req.loginInfo
        })
    }
    else{
        res.status(200).json({
            sessionState: 'NOT SAVE',
            session: null,
            info: req.loginInfo
        });
    }
});


module.exports = router;
