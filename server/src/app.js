const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');

const accountRoute = require('./routes/api/accounts');
const sanphamRoute = require('./routes/api/sanphams');
const loaisanphamRoute = require('./routes/api/loaisanphams');
const khachhangRoute = require('./routes/api/khachhangs');
const loginRoute = require('./routes/login');
const logoutRoute = require('./routes/logout');
const passportConfig = require('./config/passport');

const authChecker = require('./middlewares/authenticate-checker');

// config session
app.use(session({
    secret: 'vbdq_session',
    saveUninitialized: false,
}))


// middlewares
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(passport.initialize());
app.use(passport.session());

// config passport for authentication request
passportConfig(passport);

// route handles
app.use('/accounts', accountRoute);
app.use('/sanphams', sanphamRoute);
app.use('/loaisanphams', loaisanphamRoute);
app.use('/khachhangs', khachhangRoute);
app.use('/login', loginRoute);
app.use('/logout', logoutRoute)

app.get('/', authChecker.isUserLoggedIn, (req, res) => {
    res.status(200).json({
        message: 'automatically login'
    })
})



// error handles
app.use((req, res, next) => {
    const err = new Error('Request not found');
    err.status = 404;
    next(err);
})

app.use((err, req, res, next) => {
    res.status(err.status || 500);

    res.json({
        error: err.message
    })
})


module.exports = app;



