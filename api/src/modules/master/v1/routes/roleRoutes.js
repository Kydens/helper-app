const express = require("express");
const { createRole, getAllRole } = require("../controllers/rolesController");
const router = express.Router();

router.get("/", getAllRole);
router.post("/", createRole);

module.exports = router;
