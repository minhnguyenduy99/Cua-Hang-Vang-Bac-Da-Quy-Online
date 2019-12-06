const dichvuController      = require('../controllers/dichvuController');
const { imageUploader }     = require('../middlewares/file-uploader');
const { authorizator }         = require('../config/access-control');
const router                = require('express').Router();
const sender                = require('./response-sender');

const imageField    = 'anhdaidien';
const formParser    = imageUploader('dichvu', imageField).single(imageField);

// no authorization needed
router.get('/', dichvuController.GetAllDichVu_GET);

// authorization required
router.post('/',              authorizator(), formParser, dichvuController.ThemDichVu_POST);
router.get('/deleted',        authorizator(null, 'get_deleted'), dichvuController.GetDeletedDichVu_GET);
router.get('/:dv_id/restore', authorizator(null, 'restore'), dichvuController.RestoreDichVu_GET);
router.delete('/:dv_id',      authorizator(), dichvuController.DeleteDichVu_DELETE);
router.put('/:dv_id',         authorizator(), formParser, dichvuController.UpdateDichVu_PUT);

router.use((req, res, next) => {
    sender.send(res, req.result);
})

module.exports = router;