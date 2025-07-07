const sendResponse = require('../../../../utils/responseUtil');
const { checkIsAdmin } = require('../../../../utils/utils');
const {
  createRoleService,
  getJsonRowRoleService,
  getAllRoleService,
} = require('../services/rolesService');

const createRole = async (req, res) => {
  if (!checkIsAdmin)
    return sendResponse(
      res,
      403,
      'error',
      'Maaf, anda tidak memiliki akses ini'
    );

  try {
    const role = await createRoleService(req);
    const result = await getJsonRowRoleService(role);

    return sendResponse(
      res,
      200,
      'success',
      'Berhasil menambahkan role',
      result
    );
  } catch (error) {
    return sendResponse(
      res,
      400,
      'error',
      'Gagal menambahkan role',
      error.message
    );
  }
};

const getAllRole = async (req, res) => {
  if (!checkIsAdmin)
    return sendResponse(
      res,
      403,
      'error',
      'Maaf, anda tidak memiliki akses ini'
    );

  try {
    const role = await getAllRoleService();
    const result = await getJsonRowRoleService(role);

    return sendResponse(
      res,
      200,
      'success',
      'Berhasil menampilkan semua role',
      result
    );
  } catch (error) {
    return sendResponse(res, 500, 'error', 'gagal menampilkan semua role');
  }
};

module.exports = {
  createRole,
  getAllRole,
};
