const express = require('express');
const authMiddleware = require('./middleware/auth');
const usersMiddleware = require('./middleware/users');

const router = express.Router();

router.post('/api/login', authMiddleware.loginUser);
router.post('/api/refresh', authMiddleware.verifyRefreshToken);

router.post('/api/users', authMiddleware.verifyAccessToken, usersMiddleware.getUsersList);
router.post('/api/register', authMiddleware.verifyAccessToken, authMiddleware.createUser);

module.exports = router;
