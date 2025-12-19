const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// CORREÇÃO AQUI: Removemos as chaves { } porque o checkAuth é exportado diretamente
const checkAuth = require('../middleware/checkAuth');

// Rotas protegidas pelo checkAuth
router.get('/metrics', checkAuth, dashboardController.getMetrics);
router.get('/notes', checkAuth, dashboardController.getNotes);
router.post('/notes', checkAuth, dashboardController.saveNotes);


module.exports = router;