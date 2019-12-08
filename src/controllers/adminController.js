const responser         = require('./baseController');
const TaiKhoan          = require('../models/TaiKhoan');


module.exports.CreateAdmin_POST = (req, res, next) => {
    const body = req.body;
    TaiKhoan.create(body)
    .then(taikhoan => {
        req.result = responser.created({ data: taikhoan });
        next();
    })
    .catch(err => next(err));
}