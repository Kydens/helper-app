const express = require('express');
const router = express.Router();

const authMiddleware = require('../../../middleware/authMiddleware');
const walletsRoute = require('./v1/routes/walletsRoute');

router.use('/wallets', authMiddleware, walletsRoute);

module.exports = router;
