const SanPham      = require('../models/SanPham');
const responser    = require('./baseController');
const ImageManager = require('../models/ImageManager').getInstance();
const ErrorHandler = require('../middlewares/error-handler').ErrorHandler;

module.exports.GetToanBoSanPham_GET = (req, res, next) => {
    const condition = req.body;

    SanPham.findAllSanPham(condition)
    .then(listSanPham => {
        req.result = responser.get({ data: listSanPham });
        next();
    })
    .catch(err => next(err));
}

module.exports.GetSanPham_ByID = (req, res, next) => {
    const id = req.params.sp_id;

    SanPham.findSanPhamByID(id)
    .then(sanpham => {
        req.result = responser.get({ data: sanpham });
        next();
    })
    .catch(err => next(err));
}

module.exports.GetSanPham_BySearch_GET = (req, res, next) => {
    const search = req.query.search;

    SanPham.findBySearchPattern(search)
    .then(listSanPham => {
        req.result = responser.get({ data: listSanPham });
        next();
    })
    .catch(err => next(err));
}

module.exports.ThemSanPham_POST = (req, res, next) => {
    SanPham.createSanPham(req.body)
    .then(sanPham => {
        if (sanPham)
            req.result = responser.created({ data: sanPham });
        next();
    })
    .catch(err => {
        ImageManager.deleteImage(SanPham.name, req.body.anhdaidien);
        next(err);
    })
}

module.exports.XoaSanPham_DELETE = (req, res, next) => {
    const sp_id = req.params.sp_id;
    
    SanPham.delete(sp_id)
    .then(({ success, listSanPham }) => {
        if (success){
            req.result = responser.deleted({ data: listSanPham });
            next();
        }
        else{
            const error = ErrorHandler.createError('rs_not_found');
            next(error);
        }
    })
    .catch(err => {
        next(responser.error({ code: 500 }))
    });
}

module.exports.GetDeletedSanPham_GET = (req, res, next) => {
    SanPham.findDeletedSanPham()
    .then(listSanPham => {
        req.result = responser.get({ data: listSanPham });
        next();
    })
    .catch(err => next(err));
}

module.exports.RestoreSanPham_GET = (req, res, next) => {
    const sp_id = req.params.sp_id;

    SanPham.restoreOne(sp_id)
    .then(sanpham => {
        if (sanpham){
            req.result = responser.get({ data: sanpham })
            next();
        }
        else{
            const error = ErrorHandler.createError('rs_not_found');
            next(error);
        }
    })
    .catch(err => next(err));
}

module.exports.UpdateSanPham_PUT = (req, res, next) => {
    const sp_id = req.params.sp_id;

    SanPham.updateSanPham(sp_id, req.body)
    .then(success => {
        req.result = responser.updated({ options: {success: success} });
        next();
    })
    .catch(err => next(err));
}

