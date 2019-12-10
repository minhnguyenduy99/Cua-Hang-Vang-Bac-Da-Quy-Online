// external packages import
const express          = require('express');
const cors             = require('cors');
const bodyParser       = require('body-parser');
const morgan           = require('morgan');
const passport         = require('passport');
const session          = require('express-session');
const publicPath       = require('./config/serverConfig').publicFolderPath;
const {ErrorHandler, router: ErrorRouter}     = require('./middlewares/error-handler');

// server route import
const khachhangRoute   = require('./routes/khachhang');
const sanphamRoute     = require('./routes/sanpham');
const dichvuRoute      = require('./routes/dichvu');
const quanlyRoute      = require('./routes/quanly/route');
const nhanvienRoute    = require('./routes/nhanvien/route');
const khoRoute         = require('./routes/kho/route');
const loginRoute       = require('./routes/login');
const logoutRoute      = require('./routes/logout');


const passportConfig   = require('./config/passport');

const app = express();
app.use(cors());

// config session
app.use(session({
    secret: 'vbdq_session',
    saveUninitialized: false,
}))

// middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(passport.initialize());
app.use(passport.session());

// config passport for authentication request
passportConfig(passport);

app.use('/public', express.static(publicPath, {
    maxAge: '1d',
}));

// route handles
app.use('/sanpham', sanphamRoute);
app.use('/dichvu', dichvuRoute);
app.use('/quanly', quanlyRoute);
app.use('/nhanvien', nhanvienRoute);
app.use('/kho', khoRoute);
app.use('/login', loginRoute);
app.use('/logout', logoutRoute);
app.use('/khachhang', khachhangRoute);

// handle request not found error
app.use((req, res, next) => {
    next(ErrorHandler.createError('req_not_found'));
});

// wrap error in req to send to ErrorHandler router
app.use((err, req, res, next) => {
    req.error = err;
    next();
});

app.use(ErrorRouter, (err, req, res, next) => {
    let {status, ...errInfo} = err;
    status = status || 500;
    res.status(status);
    if (status == 500)
        console.log(`[ERROR][Unhandled] ${err.message}`);
    else   
        console.log(`[ERROR][Handled] ${err.name}`);
    res.json(errInfo);
});



module.exports = app;



