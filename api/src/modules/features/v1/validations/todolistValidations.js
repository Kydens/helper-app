const validator = require("validator");
const sendResponse = require("../../../../utils/responseUtil");

const todolistValidations = (req, res, next) => {
  const { title, description, level } = req.body;
  const errors = {};

  if (!title || validator.isEmpty(title)) {
    errors.title = "Judul harus diisi!";
  }

  if (!description || validator.isEmpty(description)) {
    errors.description = "Deskripsi harus diisi!";
  }

  if (!level || validator.isEmpty(level)) {
    errors.level = "Level harus diisi!";
  }

  if (Object.keys(errors).length > 0) {
    return sendResponse(res, 400, "error", "Validation failed", errors);
  }

  next();
};

module.exports = todolistValidations;
