const baocaoController   = require('../../controllers/baocaoController');

module.exports = (router) => {
    router.post('/baocao', baocaoController.CreateBaoCao_POST);

    router.get('/baocao', baocaoController.GetBaoCao_GET);
}
