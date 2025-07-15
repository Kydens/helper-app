const sendResponse = require('../../../../utils/responseUtil');
const { checkIsAdmin } = require('../../../../utils/utils');
const {
  createRoleService,
  getJsonRowRoleService,
  getAllRolesService,
  getRoleByIdService,
  updateRoleService,
  deleteRoleService,
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
  if (!checkIsAdmin(req)) {
    return sendResponse(
      res,
      403,
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
    const { data, total } = await getAllRolesService(
      size,
      offset,
      search,
      sortBy,
      sortOrder,
      startDate,
      endDate
    );

    const result = await getJsonRowRoleService(data);
    const totalPages = Math.ceil(total / size);

    return sendResponse(
      res,
      200,
      'success',
      'Berhasil menampilkan semua role',
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
      'Gagal menampilkan semua role',
      error.message
    );
  }
};

const getRoleById = async (req, res) => {
  if (!checkIsAdmin(req)) {
    return sendResponse(
      res,
      403,
      'error',
      'Maaf, anda tidak memiliki akses ini!'
    );
  }
  try {
    const role = await getRoleByIdService(req.params.id);
    const result = await getJsonRowRoleService(role);

    return sendResponse(
      res,
      200,
      'success',
      'Berhasil menampilkan role',
      result
    );
  } catch (error) {
    return sendResponse(
      res,
      400,
      'error',
      'Gagal menampilkan role',
      error.message
    );
  }
};

const updateRole = async (req, res) => {
  if (!checkIsAdmin)
    return sendResponse(
      res,
      403,
      'error',
      'Maaf, anda tidak memiliki akses ini'
    );

  try {
    const role = await updateRoleService(req, req.params.id);
    const result = await getJsonRowRoleService(role);

    return sendResponse(
      res,
      200,
      'success',
      'Berhasil mengupdate role',
      result
    );
  } catch (error) {
    return sendResponse(
      res,
      400,
      'error',
      'Gagal mengupdate role',
      error.message
    );
  }
};

const deleteRole = async (req, res) => {
  if (!checkIsAdmin)
    return sendResponse(
      res,
      403,
      'error',
      'Maaf, anda tidak memiliki akses ini'
    );

  try {
    const result = await deleteRoleService(req, req.params.id);

    return sendResponse(res, 200, 'success', 'Berhasil menghapus role', result);
  } catch (error) {
    return sendResponse(
      res,
      400,
      'error',
      'Gagal menghapus role',
      error.message
    );
  }
};

module.exports = {
  createRole,
  getAllRole,
  getRoleById,
  updateRole,
  deleteRole,
};
