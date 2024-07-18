const express = require('express');
const { loginController, registerController } = require('../controllers/authController.js');
const rateLimit = require('express-rate-limit');



//ip limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

//router object
const router = express.Router();

//routes

// REGISTER || POPST
router.post("/register", limiter, registerController);

// LOGIN || POST
router.post("/login", limiter, loginController);


//export
module.exports = router;
