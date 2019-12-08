const passport = require('passport');

module.exports = class AuthenticateChecker{
    static isUserLoggedIn(req, res, next) {
        req.user_logined = req.isAuthenticated();
        next();
    }
}

