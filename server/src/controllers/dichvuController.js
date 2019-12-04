const DichVu        = require('../models/DichVu');
const responser     = require('./baseController');
const ImageManager  = require('../models/ImageManager').getInstance();  
const ErrorHandler  = require('../middlewares/error-handler').ErrorHandler;

module.exports.ThemDichVu_POST = (req, res, next) => {
    
    DichVu.createDichVu(req.body)
    .then(createdDV => {
        if (createdDV)
            req.result = responser.created({ data: createdDV });
        next();
    })
    .catch(err => {
        ImageManager.deleteImage(DichVu.name, req.body.anhdaidien);
        next(err);
    });
}

module.exports.GetAllDichVu_GET = (req, res, next) => {

    DichVu.findAll()
    .then(listDV => {
        req.result = responser.get({ data: listDV });
        next();
    })
    .catch(err => next(err));
}

module.exports.GetDeletedDichVu_GET = (req, res, next) => {

    DichVu.findDeletedDichVu()
    .then(listDV => {
        req.result = responser.get({ data: listDV });
        next();
    })
    .catch(err => next(err));
}

module.exports.DeleteDichVu_DELETE = (req, res, next) => {
    const iddv = req.params.iddv;

    DichVu.delete(iddv)
    .then(({ success, listDichVu }) => {
        if (success){
            req.result = responser.deleted({ data: listDichVu });
            next();
        }
        else{
            const error = ErrorHandler.createError('rs_not_found');
            next(error);
        }
    })
    .catch(err => next(err));
}

module.exports.RestoreDichVu_GET = (req, res, next) => {
    const iddv = req.params.iddv;

    DichVu.restoreOne(iddv)
    .then(dichvu => {
        if (dichvu){
            req.result = responser.get({ data: dichvu })
            next();
        }
        else{
            const error = ErrorHandler.createError('rs_not_found');
            next(error);
        }
    })
    .catch(err => next(err));
}

module.exports.UpdateDichVu_POST = (req, res, next) => {
    const iddv = req.params.iddv;

    DichVu.updateDichVu(iddv, req.body)
    .then(success => {
        req.result = responser.updated({ options: {success: success} });
        next();
    })
    .catch(err => next(err));
}