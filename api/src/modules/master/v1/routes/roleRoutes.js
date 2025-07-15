const express = require('express');
const {
  createRole,
  getAllRole,
  getRoleById,
  updateRole,
  deleteRole,
} = require('../controllers/rolesController');
const router = express.Router();

router.get('/', getAllRole);
router.post('/', createRole);
router.get('/:id', getRoleById);
router.put('/:id', updateRole);
router.delete('/:id', deleteRole);

module.exports = router;
