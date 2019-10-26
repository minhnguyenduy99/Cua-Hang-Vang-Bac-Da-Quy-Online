const lspController = require('../../controllers/loaisanphamController');


const router = require('express').Router();

router.post('/', lspController.CreateNewLoaiSanPham_POST);

router.get('/', lspController.GetAllLoaiSanPham_GET);

router.delete('/:lsp_id', lspController.DeleteLoaiSanPham_DELETE);

module.exports = router;