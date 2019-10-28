const lspController = require('../../controllers/loaisanphamController');


const router = require('express').Router();

router.post('/', lspController.CreateNewLoaiSanPham_POST, (result, req, res, next) => {
    res.status(result.statusCode).json(result);
});

router.get('/', lspController.GetAllLoaiSanPham_GET, (result, req, res, next) => {
    res.status(result.statusCode).json(result.data);
});

router.delete('/:lsp_id', lspController.DeleteLoaiSanPham_DELETE, (result, req, res, next) => {
    res.status(result.statusCode).json(result);
});

module.exports = router;