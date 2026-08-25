const validator = require('validator');
const sendResponse = require('../../../../../utils/responseUtil');

const todolistValidations = (req, res, next) => {
  const { title, description, level, dueDate } = req.body;
  const errors = {};

  const validLevels = [
    'Sangat Penting',
    'Cukup Penting',
    'Penting',
    'Tidak Penting',
  ];

  if (!title || validator.isEmpty(title)) {
    errors.title = 'Judul harus diisi!';
  }

  if (level && !validLevels.includes(level)) {
    errors.level = 'Level tidak valid.';
  }

  if (dueDate && !validator.isISO8601(String(dueDate))) {
    errors.dueDate = 'Format tanggal tidak valid.';
  }

  if (Object.keys(errors).length > 0) {
    return sendResponse(res, 400, 'error', 'Validation failed', errors);
  }

  next();
};

module.exports = todolistValidations;
