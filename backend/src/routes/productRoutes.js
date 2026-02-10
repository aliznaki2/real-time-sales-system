const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, productController.getAll);
router.post('/', protect, adminOnly, productController.create);
router.get('/:id', protect, productController.getById);
router.put('/:id', protect, adminOnly, productController.update);
router.delete('/:id', protect, adminOnly, productController.delete);

module.exports = router;