const express = require('express');
const userMiddleware = require('./middleware/user');
const feedMiddleware = require('./middleware/feed');

const router = express.Router();

router.post('/login', userMiddleware.loginUser);
router.post('/register', userMiddleware.createUser);
router.post('/availability/nickname', userMiddleware.isNicknameAvailable);
router.post('/availability/email', userMiddleware.isEmailAvailable);

router.post('/logout', userMiddleware.checkSession, userMiddleware.logoutUser);
router.post('/user/getLogged', userMiddleware.checkSession, userMiddleware.getLoggedUser);

router.post('/account/changeEmail', userMiddleware.checkSession, userMiddleware.changeEmail);
router.post('/account/changePassword', userMiddleware.checkSession, userMiddleware.changePassword);

router.post('/feed/main', userMiddleware.checkSession, feedMiddleware.getMainFeed);
router.post('/feed/user', userMiddleware.checkSession, feedMiddleware.getUserFeed);
router.post('/feed/save', userMiddleware.checkSession, feedMiddleware.saveNewPost);

module.exports = router;
