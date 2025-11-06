const express = require('express');
const router = express.Router();

// Importamos o controlador e o middleware
const calendarController = require('../controllers/calendarController');
const { checkAuth } = require('../middleware/checkAuth');

// Definimos as rotas para /api/calendar/...

// GET /api/calendar/events
router.get('/events', checkAuth, calendarController.getAllEvents);

// POST /api/calendar/events
router.post('/events', checkAuth, calendarController.saveEvent);

// DELETE /api/calendar/events/2025-08-25
router.delete('/events/:dateKey', checkAuth, calendarController.deleteEvent);

module.exports = router;