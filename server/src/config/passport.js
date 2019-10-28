const LocalStrategy = require('passport-local').Strategy;

const Account = require('../models/Account');

module.exports = (passport) => {

    passport.use('account-login', new LocalStrategy(
        (username, password, done) => {
            Account.findOne({
                where: {username: username}
            })
            .then(account => {
                if (!account){
                    return done(null, false, {message: 'The username is incorrect'})
                }
                if (!account.isPasswordCorrect(password)){
                    return done(null, false, {message: 'The password is incorrect'})
                }
                return done(null, account, {message: 'The user is authenticated'});
            })
            .catch(err => done(err));
        }
    ))

    passport.serializeUser((account, done) => {
        done(null, account.id);
    })

    passport.deserializeUser((id, done) => {
        Account.findOne({
            where: {id: id}
        })
        .then(account => {
            done(null, account);
        })
    })
}