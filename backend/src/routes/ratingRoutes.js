const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const verifyToken = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/roleMiddleware');

router.post('/', verifyToken, allowRoles('USER'), ratingController.submitOrUpdateRating);

module.exports = router;