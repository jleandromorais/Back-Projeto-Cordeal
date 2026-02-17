const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const checkAuth = require('../middleware/checkAuth');

// Rotas protegidas (requerem autenticação)
router.post('/', checkAuth, feedbackController.createFeedback);
router.get('/', checkAuth, feedbackController.getUserFeedbacks);

// Rotas de admin (opcional - podem adicionar verificação de admin depois)
router.get('/all', checkAuth, feedbackController.getAllFeedbacks);
router.patch('/:feedbackId/status', checkAuth, feedbackController.updateFeedbackStatus);

module.exports = router;
