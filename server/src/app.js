const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');

// middlewares
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
app.use(morgan('dev'));


module.exports = app;



