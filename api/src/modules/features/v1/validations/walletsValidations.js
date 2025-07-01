const validator = require("validator");
const sendResponse = require("../../../../utils/responseUtil");

const walletsValidations = (req, res, next) => {
  const { name, description } = req.body;
  const errors = {};

  if (!name || validator.isEmpty(name)) {
    errors.name = "Nama dompet harus diisi!";
  }

  if (!description || validator.isEmpty(description)) {
    errors.description = "Deskripsi harus diisi!";
  }

  if (Object.keys(errors).length > 0) {
    return sendResponse(res, 400, "error", "Validation failed", errors);
  }

  next();
};

module.exports = walletsValidations;
