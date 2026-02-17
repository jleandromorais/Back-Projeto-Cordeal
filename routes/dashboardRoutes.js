const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const checkAuth = require('../middleware/checkAuth');

router.get('/metrics', checkAuth, dashboardController.getMetrics);
router.get('/notes', checkAuth, dashboardController.getNotes);
router.post('/notes', checkAuth, dashboardController.saveNotes);

module.exports = router;