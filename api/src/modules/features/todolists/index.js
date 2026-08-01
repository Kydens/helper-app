const express = require('express');
const router = express.Router();

const authMiddleware = require('../../../middleware/authMiddleware');
const todolistRoute = require('./v1/routes/todolistRoute');

router.use('/todolist', authMiddleware, todolistRoute);

module.exports = router;
