const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const verifyToken = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/roleMiddleware');

router.get('/user/stores', verifyToken, allowRoles('USER'), storeController.getStoresForUser);
router.get('/owner/dashboard', verifyToken, allowRoles('OWNER'), storeController.getOwnerDashboard);

module.exports = router;