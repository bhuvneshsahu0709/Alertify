const express = require('express');
const router = express.Router();
const { getDashboardAnalytics } = require('../controllers/analyticsController');
const { adminAuth } = require('../middlewares/authMiddleware');

router.get('/summary', adminAuth, getDashboardAnalytics);

module.exports = router;