const responser = require('./baseController');
const HoaDon = require('../models/HoaDon');
const ChiTietHoaDon = require('../models/ChiTietHoaDon');

module.exports.CreateNewHoaDon_POST = (req, res, next) => {
    const hoaDon = req.body.hoaDon;
    const listCTHD = req.body.listCTHD;


    HoaDon.create(hoaDon)
    .then(newHoaDon => {
        if (newHoaDon){
            listCTHD.forEach(cthd => {
                cthd.ID_HD = newHoaDon.ID_HD;
                ChiTietHoaDon.create(cthd);
            })
            next(responser.getCreatedRespone({ data: newHoaDon, message: 'Tạo hóa đơn thành công' }))
        }
        else{
            next(responser.getErrorRespone({ err: err }));
        }
    })
    .catch(err => 
        next(responser.getErrorRespone({ err: err }))
    );
}

module.exports.GetAllHoaDon_GET = (req, res, next) => {
    HoaDon.findAndIncludeAll_HoaDon()
    .then(listHoaDon => {
        if (listHoaDon){
            next(responser.getRetrieveRespone({ data: listHoaDon }));
        }
        else{
            next(responser.getErrorRespone({ err: err}));
        }
    })
}

