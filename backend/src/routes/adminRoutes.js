const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const verifyToken = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/roleMiddleware');
const { signupValidation } = require('../utils/validation');

router.use(verifyToken, allowRoles('ADMIN'));
router.get('/stats', adminController.getStats);
router.post('/users', signupValidation, adminController.createUser);
router.post('/stores', adminController.createStore);
router.get('/users', adminController.getUsers);
router.get('/stores', adminController.getStores);

module.exports = router;