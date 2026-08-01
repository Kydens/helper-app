const express = require('express');
const {
  getAllTodolist,
  createTodolist,
  getTodolistById,
  updateTodolist,
  deleteTodolist,
  getTodolistFinish,
} = require('../controllers/todolistController');
const todolistValidations = require('../validations/todolistValidations');
const router = express.Router();

router.post('/', todolistValidations, createTodolist);
router.get('/', getAllTodolist);
router.get('/:id', getTodolistById);
router.put('/:id', todolistValidations, updateTodolist);
router.put('/finish/:id', getTodolistFinish);
router.delete('/:id', deleteTodolist);

module.exports = router;
