const express = require('express');
const authMiddleware = require('./middleware/auth');
const usersMiddleware = require('./middleware/users');
const feedMiddleware = require('./middleware/feed');

const router = express.Router();

router.post('/api/login', authMiddleware.loginUser);
router.post('/api/register', authMiddleware.createUser);
router.post('/api/refresh', authMiddleware.verifyRefreshToken);

router.post('/api/feed/get', authMiddleware.verifyAccessToken, feedMiddleware.getPostsList);
router.post('/api/feed/save', authMiddleware.verifyAccessToken, feedMiddleware.saveNewPost);
router.post('/api/users', authMiddleware.verifyAccessToken, usersMiddleware.getUsersList);

module.exports = router;
