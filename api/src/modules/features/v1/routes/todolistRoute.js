const express = require("express");
const {
  getAllTodolist,
  createTodolist,
  getTodolistById,
  deleteTodolist,
  updateTodolist,
} = require("../controllers/todolistController");
const todolistValidations = require("../validations/todolistValidations");
const router = express.Router();

router.post("/", todolistValidations, createTodolist);
router.get("/", getAllTodolist);
router.get("/:id", getTodolistById);
router.put("/:id", todolistValidations, updateTodolist);
router.delete("/:id", deleteTodolist);

module.exports = router;
