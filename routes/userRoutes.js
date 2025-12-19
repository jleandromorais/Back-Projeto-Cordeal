const express = require('express');
const router = express.Router();

// Importar o controlador
const userController = require('../controllers/userController');

// Importar o middleware
// SE o checkAuth der erro, podes comentar esta linha e a linha do router.get para testar
const checkAuth = require('../middleware/checkAuth'); 

// Rota GET /profile
// Verificamos se 'userController.getUser' existe antes de usar
if (!userController.getUser) {
    console.error("ERRO CRÍTICO: userController.getUser não foi encontrado!");
}

router.get('/profile', checkAuth, userController.getUser);

module.exports = router;