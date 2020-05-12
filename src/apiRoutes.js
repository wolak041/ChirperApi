const express = require('express');
const authMiddleware = require('./middleware/auth');
const feedMiddleware = require('./middleware/feed');

const router = express.Router();

router.post('/login', authMiddleware.loginUser);
router.post('/register', authMiddleware.createUser);

router.post('/logout', authMiddleware.checkSession, authMiddleware.logoutUser);
router.post('/user/get', authMiddleware.checkSession, authMiddleware.getUser);
router.post('/feed/get', authMiddleware.checkSession, feedMiddleware.getPostsList);
router.post('/feed/save', authMiddleware.checkSession, feedMiddleware.saveNewPost);

module.exports = router;
