const express = require('express');
const userController = require('./controllers/user');
const feedController = require('./controllers/feed');
const auth = require('./middlewares/auth');

const router = express.Router();

router.post('/login', auth.localCheck, auth.createNewTokens, userController.loginUser);
router.post('/register', userController.createUser, auth.createNewTokens, userController.loginUser);
router.post('/refresh_tokens', auth.refreshTokenCheck, auth.refreshTokens);
router.post('/availability/nickname', userController.isNicknameAvailable);
router.post('/availability/email', userController.isEmailAvailable);

router.post('/user/get_logged', auth.accessTokenCheck, userController.getLoggedUser);

router.post('/account/change_email', auth.accessTokenCheck, userController.changeEmail);
router.post('/account/change_password', auth.accessTokenCheck, userController.changePassword);

router.post('/feed/main', auth.accessTokenCheck, feedController.getMainFeed);
router.post('/feed/user', auth.accessTokenCheck, feedController.getUserFeed);
router.post('/feed/save', auth.accessTokenCheck, feedController.saveNewPost);
router.post('/feed/like', auth.accessTokenCheck, feedController.likePost);
router.post('/feed/dislike', auth.accessTokenCheck, feedController.dislikePost);

module.exports = router;
