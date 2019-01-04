'use strict'

const router = require('express').Router();
const ctrl = require('../controllers/trigger-controller');

router.get('/', ctrl.getContract);
//router.put('/trigger/:equipment', ctrl.createNewEquipment);
router.put('/info/:equipment', ctrl.includeNewInfo);
router.post('/:equipment/withkey/:key', ctrl.updateWithKey);
router.post('/sinks/withkey/:key/startboard', ctrl.startBoard);


module.exports = router;
