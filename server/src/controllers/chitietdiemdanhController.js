const ChiTietDiemDanh       = require('../models/ChiTietDiemDanh');
const responser             = require('./baseController');

module.exports.Create_POST = (req, res, next) => {
    const {listdiemdanh, ngay, thang, nam} = req.body;

    ChiTietDiemDanh.createListDiemDanh(listdiemdanh, ngay, thang, nam)
    .then(listCTDD => {
        req.result = responser.created({ data: listCTDD });
        next();
    })
    .catch(err => next(err));
}

module.exports.GetDiemDanh_GET = (req, res, next) => {
    const condition = {
        ngay, thang, nam, idnv, dilam
    } = req.body;
    

    ChiTietDiemDanh.scope('raw').findAll({ where: condition })
    .then(listCTDD => {
        req.result = responser.get({ data: listCTDD });
        next();
    })
    .catch(err => next(err));
}
