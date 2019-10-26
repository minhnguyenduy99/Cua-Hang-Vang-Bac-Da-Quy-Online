const passport = require('passport');

module.exports = class AuthenticateChecker{
    static isUserLoggedIn(req, res, next) {
        const isLoggedIn = req.isAuthenticated();
        if (isLoggedIn){
            return next();    
        }
    
        return res.redirect('/login');
    }
}

