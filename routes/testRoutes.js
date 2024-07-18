const express = require('express');
const { testPostController } = require('../controllers/testController');
const userAuth = require('../middlewares/authMiddleware.js');

// Router object
const router = express.Router();

// Routes
router.post('/test-post', userAuth, testPostController);

// Export
module.exports = router;
