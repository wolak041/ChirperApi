const express = require('express');
const authMiddleware = require('./middleware/auth');
const feedMiddleware = require('./middleware/feed');

const router = express.Router();

router.post('/login', authMiddleware.loginUser);
router.post('/register', authMiddleware.createUser);

router.post('/logout', authMiddleware.checkIfSessionExists, authMiddleware.logoutUser);
router.post('/feed/get', authMiddleware.checkIfSessionExists, feedMiddleware.getPostsList);
router.post('/feed/save', authMiddleware.checkIfSessionExists, feedMiddleware.saveNewPost);

module.exports = router;
