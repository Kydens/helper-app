const { Op } = require("sequelize");
const sequelize = require("../../../../config/sequelize");
const { convertArrayToSingleJson } = require("../../../../utils/utils");
const generateUUID = require("../../../../utils/uuidUtil");
const Todolist = require("../models/f_todolist");

const createTodolistService = async (req) => {
  const userId = req.user.id;
  const now = new Date();
  const row = req.body;
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const dataTodo = {
      id: generateUUID(),
      created_at: now,
      created_by: userId,
      is_active: true,
      user_id: userId,
      title: row.title,
      description: row.description,
      level: row.level,
    };

    const rowTodolist = await Todolist.create(dataTodo, { transaction });

    const getList = await getTodolistByIdService(rowTodolist.id, transaction);
    await transaction.commit();
    return getList;
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.log("Error in create todolist service: ", error.message);
    throw error;
  }
};

const getAllTodolistService = async (
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

  const { count, rows } = await Todolist.findAndCountAll({
    where: whereClause,
    limit: parseInt(size),
    offset: parseInt(offset),
    order: [[sortBy, sortOrder.toUpperCase()]],
  });

  return { data: rows, total: count };
};

const getTodolistByIdService = async (id, transaction = null) => {
  const todolist = Todolist.findOne({
    where: { id: id, is_deleted: false },
    transaction,
  });

  if (!todolist) {
    throw new Error("Todolist tidak ditemukan");
  }

  return todolist;
};

const updateTodolistService = async (req, id) => {
  const userId = req.user.id;
  const now = new Date();
  const row = req.body;
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const dataTodo = {
      updated_at: now,
      updated_by: userId,
      is_active: true,
      user_id: userId,
      name: row.name,
      description: row.description,
      level: row.level,
    };

    await Todolist.update(dataTodo, { where: { id: id }, transaction });

    const getList = await getTodolistByIdService(id, transaction);

    await transaction.commit();
    return getList;
  } catch (error) {
    await transaction.rollback();
    console.log("Error in update todolist service: ", error.message);
    throw error;
  }
};

const deleteTodolistService = async (req, id) => {
  const userId = req.user.id;
  const now = new Date();
  await Todolist.update(
    { is_deleted: true, deleted_by: userId, deleted_at: now },
    { where: { id: id } }
  );

  return Todolist.findOne({
    where: { id: id },
    attributes: ["id", "title", "is_deleted", "is_deleted", "deleted_at"],
  });
};

const getJsonRowTodolistService = (data) => {
  const checkList = Array.isArray(data) ? "array" : "single";
  const dataArray = Array.isArray(data) ? data : [data];

  const json = dataArray.map((row) => ({
    id: row.id,
    createdAt: row.created_at,
    createdBy: row.created_by,
    isActive: row.is_active,
    userId: row.user_id,
    title: row.title,
    description: row.description,
    level: row.level,
  }));

  if (checkList == "array") {
    return json;
  } else {
    return convertArrayToSingleJson(json);
  }
};

module.exports = {
  createTodolistService,
  getAllTodolistService,
  getTodolistByIdService,
  updateTodolistService,
  deleteTodolistService,
  getJsonRowTodolistService,
};
