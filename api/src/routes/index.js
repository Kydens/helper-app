const express = require("express");
const router = express.Router();

const userModules = require("../modules/auth");
const featuresModules = require("../modules/features");
const masterModules = require("../modules/master");

router.use("/api", userModules);
router.use("/api", featuresModules);
router.use("/api", masterModules);

module.exports = router;
