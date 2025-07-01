const sequelize = require("../../../../config/sequelize");
const { convertArrayToSingleJson } = require("../../../../utils/utils");
const generateUUID = require("../../../../utils/uuidUtil");
const Wallets = require("../models/f_wallets");

const createWalletsService = async (req) => {
  const userId = req.user.id;
  const now = new Date();
  const row = req.body;
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const checkExistingWallets = await Wallets.findOne({
      where: { name: row.name.trim(), user_id: userId, is_deleted: false },
    });

    if (checkExistingWallets) {
      throw new Error("Wallet anda sudah ada.");
    }

    const dataWallet = {
      id: generateUUID(),
      created_at: now,
      created_by: userId,
      is_active: true,
      user_id: userId,
      name: row.name,
      description: row.description,
      balances: row.balances ?? 0.0,
    };

    const rowWallets = await Wallets.create(dataWallet, { transaction });

    const getList = await getWalletsByIdService(rowWallets.id, transaction);
    await transaction.commit();
    return getList;
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.log("Error in create wallets service: ", error.message);
    throw error;
  }
};

const getAllWalletsService = async (
  userId,
  size,
  offset,
  search = "",
  sortBy = "created_at",
  sortOrder = "DESC",
  startDate,
  endDate
) => {
  const whereClause = {
    is_deleted: false,
  };

  if (userId) {
    whereClause.user_id = userId;
  }

  if (search) {
    whereClause[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } },
    ];
  }

  if (startDate && endDate) {
    whereClause.created_at = {
      [Op.between]: [startDate, endDate],
    };
  }

  const { count, rows } = await Wallets.findAndCountAll({
    where: whereClause,
    limit: parseInt(size),
    offset: parseInt(offset),
    order: [[sortBy, sortOrder.toUpperCase()]],
  });

  return { data: rows, total: count };
};

const getWalletsByIdService = async (id, transaction = null) => {
  const wallet = Wallets.findOne({
    where: { id: id, is_deleted: false },
    transaction,
  });

  if (!wallet) {
    throw new Error("Wallet tidak ditemukan");
  }

  return wallet;
};

const updateWalletsService = async (req, id) => {
  const userId = req.user.id;
  const now = new Date();
  const row = req.body;
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const dataWallet = {
      updated_at: now,
      updated_by: userId,
      is_active: true,
      user_id: userId,
      name: row.name,
      description: row.description,
      balances: row.balances ?? 0.0,
    };

    await Wallets.update(dataWallet, { where: { id: id }, transaction });

    const getList = await getWalletsByIdService(id, transaction);

    await transaction.commit();
    return getList;
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.log("Error in create wallets service: ", error.message);
    throw error;
  }
};

const deleteWalletsService = async (req, id) => {
  const userId = req.user.id;
  const now = new Date();
  await Wallets.update(
    { is_deleted: true, deleted_by: userId, deleted_at: now },
    { where: { id: id } }
  );

  return Wallets.findOne({
    where: { id: id },
    attributes: ["id", "name", "is_deleted", "is_deleted", "deleted_at"],
  });
};

const getJsonRowWalletsService = (data) => {
  const checkList = Array.isArray(data) ? "array" : "single";
  const dataArray = Array.isArray(data) ? data : [data];

  const json = dataArray.map((row) => ({
    id: row.id,
    createdAt: row.created_at,
    createdBy: row.created_by,
    isActive: row.is_active,
    userId: row.user_id,
    name: row.name,
    description: row.description,
    balances: row.balances,
  }));

  if (checkList == "array") {
    return json;
  } else {
    return convertArrayToSingleJson(json);
  }
};

module.exports = {
  createWalletsService,
  getAllWalletsService,
  getWalletsByIdService,
  updateWalletsService,
  deleteWalletsService,
  getJsonRowWalletsService,
};
