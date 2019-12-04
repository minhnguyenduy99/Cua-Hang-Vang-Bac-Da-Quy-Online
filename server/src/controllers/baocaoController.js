const BaoCao            = require('../models/BaoCao');
const responser         = require('./baseController');


module.exports.CreateBaoCao_POST = (req, res, next) => {
    BaoCao.createBaoCao(req.body)
    .then(newBaoCao => {
        req.result = responser.created({ data: newBaoCao });
        next();
    })
    .catch(err => {
        console.log(err);
        next(err);
    })
}

module.exports.GetBaoCao_GET = (req, res, next) => {
    const condition = req.query;
    BaoCao.findWithDynamicCondition(condition)
    .then(listBaoCao => {
        req.result = responser.get({ data: listBaoCao });
        next();
    })
    .catch(err =>{
        next(err)
    });
}