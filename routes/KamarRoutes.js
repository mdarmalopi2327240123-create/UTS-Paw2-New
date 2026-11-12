const express = require('express');
const router = express.Router();
const kamarController = require('../controllers/KamarController');

router.get('/', kamarController.getAll);
router.get('/:id', kamarController.getById);
router.post('/', kamarController.create);
router.put('/:id', kamarController.update);
router.delete('/:id', kamarController.remove);

module.exports = router;
