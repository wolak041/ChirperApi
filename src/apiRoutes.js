const express = require('express');
const authMiddleware = require('./middleware/auth');
const feedMiddleware = require('./middleware/feed');

const router = express.Router();

router.post('/login', authMiddleware.loginUser);
router.post('/register', authMiddleware.createUser);
router.post('/availability/nickname', authMiddleware.isNicknameAvailable);
router.post('/availability/email', authMiddleware.isEmailAvailable);

router.post('/logout', authMiddleware.checkSession, authMiddleware.logoutUser);
router.post('/user/getLogged', authMiddleware.checkSession, authMiddleware.getLoggedUser);
router.post('/feed/main', authMiddleware.checkSession, feedMiddleware.getMainFeed);
router.post('/feed/user', authMiddleware.checkSession, feedMiddleware.getUserFeed);
router.post('/feed/save', authMiddleware.checkSession, feedMiddleware.saveNewPost);

module.exports = router;
