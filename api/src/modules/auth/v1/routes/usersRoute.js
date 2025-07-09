const express = require('express');
const {
  getAllUsers,
  getUserById,
  createUsers,
  deleteUser,
} = require('../controllers/usersController');
const router = express.Router();

router.get('/', getAllUsers);
router.post('/', createUsers);
router.get('/:id', getUserById);
router.delete('/:id', deleteUser);

module.exports = router;
