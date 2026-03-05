/**
 * Auth Routes — Connected to: Login.jsx
 */
const router = require('express').Router();
const { validate } = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');
const authController = require('../controllers/authController');
const { loginSchema } = require('../config/schemas');

router.post('/login', authLimiter, validate(loginSchema), authController.login);

module.exports = router;
