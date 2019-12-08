const responser = require('./baseController');
const Phieu = require('../models/Phieu');
const ChiTietphieu = require('../models/ChiTietphieu');

module.exports.CreateNewphieu_POST = (req, res, next) => {
    const loaiphieu = parseInt(req.params.idloaiphieu);

    Phieu.createPhieu(req.body, loaiphieu)
    .then(newphieu => {
        if (newphieu)
            req.result = responser.created({ data: newphieu })
        next();
    })
    .catch(err => next(err));
}

module.exports.GetPhieuByLoaiPhieu_GET = (req, res, next) => {
    const loaiphieu = parseInt(req.params.idloaiphieu);
    const condition = req.body;

    Phieu.findByDynamicallyCondition(loaiphieu, condition)
    .then(danhsachPhieu => {
        req.result = responser.get({ data: danhsachPhieu });
        next();
    })
    .catch(err => next(err));
}

module.exports.GetAllPhieu_GET = (req, res, next) => {
    
    if (req.query){
        this.GetAllChiTietPhieu_GET(req, res, next);
    }
    else{
        Phieu.findAllPhieu()
        .then(listPhieu => {
            req.result = responser.get({ data: listPhieu });
            next();
        })
        .catch(err => {
            next(err);
        })
    }
}

module.exports.GetAllChiTietPhieu_GET = (req, res, next) => {
    const { idphieu, loaiphieu } = req.query;

    ChiTietphieu.findAllCTPhieu(idphieu, parseInt(loaiphieu))
    .then(listCTPhieu => {
        req.result = responser.get({ data: listCTPhieu });
        next();
    })
    .catch(err => next(err));
}

