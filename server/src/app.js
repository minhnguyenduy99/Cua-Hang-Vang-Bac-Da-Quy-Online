// external packages import
const express          = require('express');
const bodyParser       = require('body-parser');
const morgan           = require('morgan');
const passport         = require('passport');
const session          = require('express-session');
const publicPath       = require('./config/serverConfig').publicFolderPath;
const ErrorHandler     = require('./middlewares/error-handler');

// server route import
const loginRoute       = require('./routes/login');
const khachhangRoute   = require('./routes/api/khachhangs');
const nhanvienRoute    = require('./routes/api/nhanviens');
const sanphamRoute     = require('./routes/api/sanphams');
const nhacungcapRoute  = require('./routes/api/nhacungcaps');
const phieuRoute       = require('./routes/api/phieus');
const dichvuRoute      = require('./routes/api/dichvus');
const quanlyRoute      = require('./routes/quanly');

const passportConfig   = require('./config/passport');
const authChecker      = require('./middlewares/authenticate-checker');

const app = express();

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


app.use('/public', express.static(publicPath, {
    maxAge: '1d',
}));

// route handles
app.use('/login', loginRoute);
app.use('/quanly', quanlyRoute);
app.use('/khachhangs', khachhangRoute);
app.use('/nhanviens', nhanvienRoute);
app.use('/sanphams', sanphamRoute);
app.use('/nhacungcaps', nhacungcapRoute);
app.use('/phieus', phieuRoute);
app.use('/dichvus', dichvuRoute);



app.get('/', authChecker.isUserLoggedIn, (req, res) => {
    if (req.user_logined){
        res.status(200).json({
            message: 'Tự động đăng nhập'
        })
    }
    else{
        res.redirect('/login');
    }
})


app.use(ErrorHandler.request_not_found);
app.use(ErrorHandler.resource_not_found);
app.use(ErrorHandler.validation_error);
app.use(ErrorHandler.database_error);

// error handlers
app.use((err, req, res, next) => {
    let {status, ...errInfo} = err;
    status = status || 500;
    res.status(status);
    if (status == 500)
        console.log(`[ERROR][Unhandled] ${err}`);
    else   
        console.log(`[ERROR][Handled] ${err.name}`);
    res.json(errInfo);
});



module.exports = app;



