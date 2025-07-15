const express = require('express');
const router = express.Router();

const authMiddleware = require('../../middleware/authMiddleware');

const roleRoutes = require('./v1/routes/roleRoutes');

router.use('/master/roles', authMiddleware, roleRoutes);

module.exports = router;
