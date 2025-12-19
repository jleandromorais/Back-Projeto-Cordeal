const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// OLHA AQUI A MUDANÇA: SEM CHAVES!
// ERRADO (O que tens lá): const { checkAuth } = require('../middleware/checkAuth');
// CERTO (O que vais pôr):
const checkAuth = require('../middleware/checkAuth');

router.get('/metrics', checkAuth, dashboardController.getMetrics);
router.get('/notes', checkAuth, dashboardController.getNotes);
router.post('/notes', checkAuth, dashboardController.saveNotes);

module.exports = router;