// Crie este novo ficheiro: routes/userRoutes.js

const express = require('express');
const router = express.Router();

// Importamos o controlador e o middleware
const userController = require('../controllers/userController');
const { checkAuth } = require('../middleware/checkAuth');

// Definimos a rota: GET /api/user/me
// O 'checkAuth' protege a rota, e 'getUserData' responde
router.get('/me', checkAuth, userController.getUserData);

module.exports = router;