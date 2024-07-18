const express = require('express');
const { updateUserController } = require('../controllers/userController');
const userAuth = require('../middlewares/authMiddleware');

// Router object
const router = express.Router();

// Routes
// UPDATE USER || PUT
router.put('/update-user', userAuth, updateUserController);

// Export
module.exports = router;
