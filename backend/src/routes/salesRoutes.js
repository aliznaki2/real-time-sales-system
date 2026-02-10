const express = require('express');
const router = express.Router();
const { getTodayStats, getDailySales } = require('../controllers/salesController');
const { protect } = require('../middleware/authMiddleware');

router.get('/today', protect, getTodayStats);
router.get('/daily', protect, getDailySales);

module.exports = router;