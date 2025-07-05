const sendResponse = require('../../../../utils/responseUtil');
const { getUserIdFromToken, checkIsAdmin } = require('../../../../utils/utils');
const {
  createUserService,
  getJsonRowUserService,
  getAllUsersService,
  getUserByIdService,
} = require('../services/usersService');

const createUsers = async (req, res) => {
  try {
    const user = await createUserService(req);
    const result = await getJsonRowUserService(user);

    return sendResponse(
      res,
      200,
      'success',
      'Berhasil menambahkan akun user',
      result
    );
  } catch (error) {
    return sendResponse(
      res,
      400,
      'error',
      'Gagal menambahkan akun user',
      error.message
    );
  }
};

const getAllUsers = async (req, res) => {
  if (!checkIsAdmin) {
    return sendResponse(
      res,
      500,
      'error',
      'Maaf, anda tidak memiliki akses ini!'
    );
  }

  try {
    const {
      size = 10,
      page = 0,
      search = '',
      sortBy = 'created_at',
      sortOrder = 'DESC',
      startDate,
      endDate,
    } = req.query;

    const offset = parseInt(page) * parseInt(size);
    const { data, total } = await getAllUsersService(
      size,
      offset,
      search,
      sortBy,
      sortOrder,
      startDate,
      endDate
    );

    const result = await getJsonRowUserService(data);
    const totalPages = Math.ceil(total / size);

    return sendResponse(
      res,
      200,
      'success',
      'Berhasil menampilkan semua user',
      {
        data: result,
        paging: {
          currentPage: parseInt(page),
          totalPage: totalPages,
          total: total,
          size: parseInt(size),
        },
      }
    );
  } catch (error) {
    return sendResponse(
      res,
      500,
      'error',
      'Gagal menampilkan semua user',
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
      'success',
      'Berhasil menampilkan user',
      result
    );
  } catch (error) {
    return sendResponse(
      res,
      500,
      'error',
      'Gagal menampilkan user',
      error.message
    );
  }
};

module.exports = {
  createUsers,
  getAllUsers,
  getUserById,
};
