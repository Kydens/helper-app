const express = require('express');
const router = express.Router();

const todolistRoute = require('./todolists');
const walletRoute = require('./wallets');

router.use('/features', [todolistRoute, walletRoute]);

module.exports = router;
