const imageUploader         = require('../../middlewares/file-uploader').imageUploader;
const dichvuController      = require('../../controllers/dichvuController');
const sender                = require('./response-sender');
const router                = require('express').Router();

const field = 'anhdaidien';

const uploader = imageUploader('dichvu', field).single(field)

router.post('/create', uploader, dichvuController.ThemDichVu_POST, (req, res, next) => {
        sender.send(res, req.result);
});

router.post('/:iddv/update', uploader, dichvuController.UpdateDichVu_POST, (req, res, next) => {
    sender.send(res, req.result);
})

router.get('/', dichvuController.GetAllDichVu_GET, (req, res, next) => {
    sender.send(res, req.result);
});

router.get('/deleted', dichvuController.GetDeletedDichVu_GET, (req, res, next) => {
    sender.send(res, req.result);
})

router.get('/:iddv/restore', dichvuController.RestoreDichVu_GET, (req, res, next) => {
    sender.send(res, req.result);
})

router.delete('/:iddv', dichvuController.DeleteDichVu_DELETE, (req, res, next) => {
    sender.send(res, req.result);
});

module.exports = router;