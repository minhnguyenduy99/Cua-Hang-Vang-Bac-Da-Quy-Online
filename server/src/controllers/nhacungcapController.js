const NhaCungCap    = require('../models/NhaCungCap');
const responser     = require('./baseController');
const ImageManager  = require('../models/ImageManager').getInstance();
const PhieuNhapKho    = require('../models/PhieuNhapKho');

module.exports.RegisterNhaCungCap_POST = (req, res, next) => {
    NhaCungCap.create(req.body)
    .then(newNCC => {
        if (newNCC)
            req.result = responser.created({ data: newNCC });
        next();
    })
    .catch(err => {
        ImageManager.deleteImage('NhaCungCap', req.body.anhdaidien);
        next(err);
    })
}

module.exports.GetAllNhaCungCap_GET = (req, res, next) => {
    NhaCungCap.findAll()
    .then(listNCC => {
        req.result = responser.get({ data: listNCC })
        next();
    })
    .catch(err => next(err));
}

module.exports.GetNhaCungCap_ByID_GET = (req, res, next) => {
    const idnhacc = req.params.nhacc_id;
    NhaCungCap.findOne({
        where: {idnhacc: idnhacc}
    })
    .then(nhacc => {
        req.result = responser.get({ data: nhacc })
        next();
    })
    .catch(err => next(err));
}

module.exports.GetAllSanPham_ByID_GET = (req, res, next) => {
    const idnhacc = req.params.nhacc_id;
    NhaCungCap.findAllSanPham(idnhacc)
    .then(nhacungcap_sp => {
        let data = null;

        if (!nhacungcap_sp)     data = null;
        else                    data = nhacungcap_sp.getDataValue('danhsach_sanpham');

        req.result = responser.get({ data: data })
        next();
    })
    .catch(err => next(err));
}

module.exports.GetAllPhieuNhapKho_GET = (req, res, next) => {
    const id_nhacc = req.params.nhacc_id;

    PhieuNhapKho.findAllByIDNhaCC(id_nhacc)
    .then(listPhieu => {
        req.result = responser.get({ data: listPhieu });
        next();
    })
    .catch(err => {
        next(err)
    });
}

module.exports.UpdateNhaCungCap_POST = (req, res, next) => {
    const idnhacc = req.params.nhacc_id;

    NhaCungCap.updateThongTin(idnhacc, req.body)
    .then(success => {
        req.result = responser.updated({ options: { success: success }});
        next();
    })
    .catch(err => next(err));
}