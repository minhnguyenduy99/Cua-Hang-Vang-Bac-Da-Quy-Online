const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');

const userRoute = require('./routes/api/users');

// middlewares
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
app.use(morgan('dev'));


app.use('/users', userRoute);


app.use((req, res, next) => {
    const err = new Error('Not found');
    err.status(404);
    next(err);
})

app.use((err, req, res, next) => {
    res.status(err.status | 500);

    res.json({
        message: err.message
    })
})


module.exports = app;



