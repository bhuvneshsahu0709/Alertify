const express = require('express');
const router = express.Router();
const { getActiveAlerts, markAsRead, snoozeAlert } = require('../controllers/userController');
const { auth } = require('../middlewares/authMiddleware');

router.get('/alerts', auth, getActiveAlerts);
router.post('/alerts/:alertId/read', auth, markAsRead);
router.post('/alerts/:alertId/snooze', auth, snoozeAlert);

module.exports = router;