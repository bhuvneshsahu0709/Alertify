const express = require('express');
const router = express.Router();
const { createAlert, getAlerts, updateAlert, archiveAlert, getUsersAndTeams } = require('../controllers/adminController');
const { adminAuth } = require('../middlewares/authMiddleware');

router.post('/alerts', adminAuth, createAlert);
router.get('/alerts', adminAuth, getAlerts);
router.put('/alerts/:id', adminAuth, updateAlert);
router.delete('/alerts/:id', adminAuth, archiveAlert);
router.get('/targets', adminAuth, getUsersAndTeams);

module.exports = router;