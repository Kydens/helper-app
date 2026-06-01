const express = require('express');
const authController = require('../controllers/authController');
const { createUsers } = require('../controllers/usersController');
const router = express.Router();

router.post('/signup', createUsers);
router.post('/login', authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authController.logout);

module.exports = router;
