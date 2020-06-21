const express = require('express');
const userController = require('./controllers/user');
const feedController = require('./controllers/feed');
const auth = require('./middlewares/auth');

const router = express.Router();

router.post('/login', auth.localCheck, userController.loginUser);
router.post('/register', userController.createUser);
router.post('/availability/nickname', userController.isNicknameAvailable);
router.post('/availability/email', userController.isEmailAvailable);

router.post('/logout', auth.jwtCheck, userController.logoutUser);
router.post('/user/getLogged', auth.jwtCheck, userController.getLoggedUser);

router.post('/account/changeEmail', auth.jwtCheck, userController.changeEmail);
router.post('/account/changePassword', auth.jwtCheck, userController.changePassword);

router.post('/feed/main', auth.jwtCheck, feedController.getMainFeed);
router.post('/feed/user', auth.jwtCheck, feedController.getUserFeed);
router.post('/feed/save', auth.jwtCheck, feedController.saveNewPost);
router.post('/feed/like', auth.jwtCheck, feedController.likePost);
router.post('/feed/dislike', auth.jwtCheck, feedController.dislikePost);

module.exports = router;
