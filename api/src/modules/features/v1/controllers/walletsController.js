const sendResponse = require("../../../../utils/responseUtil");
const { checkIsAdmin } = require("../../../../utils/utils");
const {
  getAllWalletsService,
  createWalletsService,
  getJsonRowWalletsService,
  updateWalletsService,
  deleteWalletsService,
  getWalletsByIdService,
} = require("../services/walletsService");

const createWallets = async (req, res) => {
  try {
    const wallet = await createWalletsService(req);
    const result = await getJsonRowWalletsService(wallet);

    return sendResponse(
      res,
      200,
      "success",
      "Berhasil menambahkan wallet",
      result
    );
  } catch (error) {
    return sendResponse(
      res,
      400,
      "error",
      "Gagal menambahkan wallet",
      error.message
    );
  }
};

const getAllWallets = async (req, res) => {
  let userId = req.user.id;

  if (checkIsAdmin) {
    userId = null;
  }

  try {
    const {
      size = 10,
      page = 0,
      search = "",
      sortBy = "created_at",
      sortOrder = "DESC",
      startDate,
      endDate,
    } = req.query;

    const offset = parseInt(page) * parseInt(size);
    const { data, total } = await getAllWalletsService(
      userId,
      size,
      offset,
      search,
      sortBy,
      sortOrder,
      startDate,
      endDate
    );

    const result = await getJsonRowWalletsService(data);

    const totalPages = Math.ceil(total / size);

    return sendResponse(
      res,
      200,
      "success",
      "Berhasil menampilkan semua wallets",
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
      "error",
      "Gagal menampilkan semua wallets",
      error.message
    );
  }
};

const getWalletsById = async (req, res) => {
  try {
    const wallet = await getWalletsByIdService(req.params.id);
    const result = await getJsonRowWalletsService(wallet);

    return sendResponse(
      res,
      200,
      "success",
      "Berhasil menampilkan wallet",
      result
    );
  } catch (error) {
    return sendResponse(
      res,
      400,
      "error",
      "Gagal menampilkan wallet",
      error.message
    );
  }
};

const updateWallets = async (req, res) => {
  try {
    const wallet = await updateWalletsService(req, req.params.id);
    const result = await getJsonRowWalletsService(wallet);

    return sendResponse(
      res,
      200,
      "success",
      "Berhasil mengupdate wallet",
      result
    );
  } catch (error) {
    return sendResponse(
      res,
      400,
      "error",
      "Gagal mengupdate wallet",
      error.message
    );
  }
};

const deleteWallets = async (req, res) => {
  try {
    const result = await deleteWalletsService(req, req.params.id);

    return sendResponse(
      res,
      200,
      "success",
      "Berhasil menghapus wallet",
      result
    );
  } catch (error) {
    return sendResponse(
      res,
      400,
      "error",
      "Gagal menghapus wallet",
      error.message
    );
  }
};

module.exports = {
  createWallets,
  getAllWallets,
  getWalletsById,
  updateWallets,
  deleteWallets,
};
