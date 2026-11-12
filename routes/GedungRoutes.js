const express = require('express');
const router = express.Router();
const gedungController = require('../controllers/GedungController');

router.get('/', gedungController.getAll);
router.get('/:id', gedungController.getById);
router.post('/', gedungController.create);
router.put('/:id', gedungController.update);
router.delete('/:id', gedungController.remove);

module.exports = router;
