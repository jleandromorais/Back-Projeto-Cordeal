const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const checkAuth = require('../middleware/checkAuth'); 

router.get('/profile', checkAuth, userController.getUser);
router.post('/save-quiz', checkAuth, userController.saveQuizResult);
router.get('/stats', checkAuth, userController.getUserStats);

module.exports = router;