const express = require("express");
const {
  getAllUsers,
  getUserById,
  createUsers,
} = require("../controllers/usersController");
const router = express.Router();

router.get("/", getAllUsers);
router.post("/", createUsers);
router.get("/:id", getUserById);

module.exports = router;
