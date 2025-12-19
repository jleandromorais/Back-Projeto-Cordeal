const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const checkAuth = require('../middleware/checkAuth'); // Protege a rota

router.post('/message', checkAuth, chatController.sendMessage);

module.exports = router;