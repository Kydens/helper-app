const express = require('express');
const {
  getAllUsers,
  getUserById,
  createUsers,
  deleteUser,
  updateUsers,
} = require('../controllers/usersController');
const router = express.Router();

router.get('/', getAllUsers);
router.post('/', createUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUsers);
router.delete('/:id', deleteUser);

module.exports = router;
