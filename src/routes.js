const express = require('express');
const userController = require('./controllers/user');
const feedController = require('./controllers/feed');
const auth = require('./middlewares/auth');

const router = express.Router();

router.post('/login', auth.localCheck, auth.createNewTokens, userController.loginUser);
router.post('/register', userController.createUser, auth.createNewTokens, userController.loginUser);
router.get('/refreshed-tokens', auth.refreshTokenCheck, auth.refreshTokens);
router.get('/availability/nickname/:nickname', userController.isNicknameAvailable);
router.get('/availability/email/:email', userController.isEmailAvailable);

router.get('/logged-user', auth.accessTokenCheck, userController.getLoggedUser);

router.put('/user/change-email', auth.accessTokenCheck, userController.changeEmail);
router.put('/user/change-password', auth.accessTokenCheck, userController.changePassword);

router.post('/feed/main', auth.accessTokenCheck, feedController.getMainFeed);
router.post('/feed/user', auth.accessTokenCheck, feedController.getUserFeed);
router.post('/feed/save', auth.accessTokenCheck, feedController.saveNewPost);
router.put('/feed/like', auth.accessTokenCheck, feedController.likePost);
router.put('/feed/dislike', auth.accessTokenCheck, feedController.dislikePost);

module.exports = router;
