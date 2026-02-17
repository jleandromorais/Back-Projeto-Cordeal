const express = require('express');
const router = express.Router();

// Importar o controlador corretamente
const calendarController = require('../controllers/calendarController');
// Importar o checkAuth se quiseres proteger a rota (opcional por agora)
const checkAuth = require('../middleware/checkAuth'); 

// Rota GET: Buscar eventos (protegida)
router.get('/', checkAuth, calendarController.getEvents);

// Rota POST: Criar evento (protegida)
router.post('/', checkAuth, calendarController.createEvent);

module.exports = router;