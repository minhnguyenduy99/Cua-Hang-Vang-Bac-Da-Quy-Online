const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');

const userRoute = require('./routes/api/users');
const loginRoute = require('./routes/login');

const session = require('express-session');


// middlewares
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
app.use(morgan('dev'));


// middlewares
app.use(session(
    {
        secret: 'user_session',
        resave: true,
        saveUninitialized: false,
        cookie: {maxAge: 60000, secure: false}
    }
))

app.get('/', (req, res, next) => {
    // load homepage with authentication
    if (req.session.user_id){
        res.status(200).json({
            message: 'Automatically login'
        })
    }
    else{
        res.status(200).json({
            message: 'Not login yet'
        })
    }
})

app.use('/users', userRoute);
app.use('/login', loginRoute);

// error handles
app.use((req, res, next) => {
    const err = new Error('Request not found');
    err.status = 404;
    next(err);
})

app.use((err, req, res, next) => {
    res.status(err.status || 500);

    res.json({
        message: err.message
    })
})


module.exports = app;



