const express = require('express');
const router = express.Router();

// Importar o controlador corretamente
const calendarController = require('../controllers/calendarController');
// Importar o checkAuth se quiseres proteger a rota (opcional por agora)
const checkAuth = require('../middleware/checkAuth'); 

// Rota GET: Buscar eventos
// Se o 'calendarController.getEvents' não existir, dá o erro que viste!
router.get('/', calendarController.getEvents);

// Rota POST: Criar evento
router.post('/', calendarController.createEvent);

module.exports = router;