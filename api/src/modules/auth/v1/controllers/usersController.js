const sendResponse = require("../../../../utils/responseUtil");
const { getUserIdFromToken } = require("../../../../utils/utils");
const {
  createUserService,
  getJsonRowUserService,
  getAllUsersService,
  getUserByIdService,
} = require("../services/usersService");

const createUsers = async (req, res) => {
  try {
    const user = await createUserService(req);
    const result = await getJsonRowUserService(user);

    return sendResponse(
      res,
      200,
      "success",
      "Berhasil menambahkan akun user",
      result
    );
  } catch (error) {
    return sendResponse(
      res,
      400,
      "error",
      "Gagal menambahkan akun user",
      error.message
    );
  }
};

const getAllUsers = async (req, res) => {
  try {
    const user = await getAllUsersService();
    const result = await getJsonRowUserService(user);

    return sendResponse(
      res,
      200,
      "success",
      "Berhasil menampilkan semua user",
      result
    );
  } catch (error) {
    return sendResponse(
      res,
      500,
      "error",
      "Gagal menampilkan semua user",
      error.message
    );
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = await getUserIdFromToken(req);
    const user = await getUserByIdService(userId);
    const result = await getJsonRowUserService(user);

    return sendResponse(
      res,
      200,
      "success",
      "Berhasil menampilkan user",
      result
    );
  } catch (error) {
    return sendResponse(
      res,
      500,
      "error",
      "Gagal menampilkan user",
      error.message
    );
  }
};

module.exports = {
  createUsers,
  getAllUsers,
  getUserById,
};
