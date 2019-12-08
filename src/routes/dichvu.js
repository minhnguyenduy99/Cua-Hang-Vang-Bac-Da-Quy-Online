const dichvuController      = require('../controllers/dichvuController');
const { imageUploader }     = require('../middlewares/file-uploader');
const { authorizator }         = require('../config/access-control');
const router                = require('express').Router();
const sender                = require('./response-sender');

// no authorization needed
router.get('/', dichvuController.GetAllDichVu_GET);

// authorization required
router.post('/',              authorizator(), dichvuController.ThemBulkDichVu_POST);
router.get('/deleted',        authorizator(null, 'get_deleted'), dichvuController.GetDeletedDichVu_GET);
router.get('/:dv_id/restore', authorizator(null, 'restore'), dichvuController.RestoreDichVu_GET);
router.delete('/:dv_id',      authorizator(), dichvuController.DeleteDichVu_DELETE);
router.put('/:dv_id',         authorizator(), dichvuController.UpdateDichVu_PUT);

router.use((req, res, next) => {
    sender.send(res, req.result);
})

module.exports = router;