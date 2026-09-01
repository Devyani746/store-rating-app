const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/authMiddleware');
const { signupValidation, passwordUpdateValidation } = require('../utils/validation');

router.post('/signup', signupValidation, authController.signup);
router.post('/login', authController.login);
router.put('/change-password', verifyToken, passwordUpdateValidation, authController.changePassword);

module.exports = router;