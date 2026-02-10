const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', protect, orderController.create);
router.get('/my-orders', protect, orderController.getMyOrders);
router.get('/', protect, adminOnly, orderController.getAllOrders);

module.exports = router;