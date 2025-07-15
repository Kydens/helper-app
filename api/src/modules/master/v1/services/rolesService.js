const pool = require('../../../../config/database');
const Roles = require('../models/s_roles');
const {
  generateAlias,
  getCheckAlias,
  generateNewAlias,
  convertArrayToSingleJson,
} = require('../../../../utils/utils');
const generateUUID = require('../../../../utils/uuidUtil');
const sequelize = require('../../../../config/sequelize');

let tableDB = 's_roles';

const createRoleService = async (req) => {
  const userId = req.user.id;
  const now = new Date();
  const row = req.body;
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const rowDataRole = {
      id: generateUUID(),
      created_at: now,
      created_by: userId,
      is_active: row.isActive,
      name: row.name,
      alias: row.alias,
      description: row.description,
    };

    let alias = await generateAlias(rowDataRole.alias);
    rowDataRole.alias = alias;
    const checkAlias = await getCheckAlias(Roles, alias);

    if (checkAlias) {
      let newAlias = await generateNewAlias(Roles, rowDataRole.alias);
      rowDataRole.alias = newAlias;
    }

    const rowRole = await Roles.create(rowDataRole, { transaction });

    await transaction.commit();
    return rowRole;
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.log('Error in create role service: ', error.message);
    throw error;
  }
};

const getAllRolesService = async (
  size,
  offset,
  search = '',
  sortBy = 'created_at',
  sortOrder = 'DESC',
  startDate,
  endDate
) => {
  const whereClause = {
    is_deleted: false,
  };

  if (search) {
    whereClause[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { alias: { [Op.iLike]: `%${search}%` } },
    ];
  }

  if (startDate && endDate) {
    whereClause.created_at = {
      [Op.between]: [startDate, endDate],
    };
  }

  const { count, rows } = await Roles.findAndCountAll({
    where: whereClause,
    limit: parseInt(size),
    offset: parseInt(offset),
    order: [[sortBy, sortOrder.toUpperCase()]],
  });

  return { data: rows, total: count };
};

const getRoleByIdService = async (id, transaction = null) => {
  const role = await Roles.findOne({
    where: { id: id, is_deleted: false },
    transaction,
  });

  if (!role) {
    throw new Error('Role tidak ditemukan');
  }

  return role;
};

const getRoleByIdUserService = async (userId) => {
  let query = `
    SELECT 
      json_build_object(
        'id', su.id,
        'fullname', su.fullname
      ) AS users,
      json_build_object(
        'id', sr.id,
        'name', sr.name,
        'alias', sr.alias
      ) AS roles
    FROM ${tableDB} sr
    LEFT JOIN s_user_roles sur ON sr.id = sur.role_id
    LEFT JOIN s_users su ON sur.user_id = su.id
    WHERE sr.is_deleted = false AND su.id = $1
  `;

  const { rows } = await pool.query(query, [userId]);

  if (rows.length === 0) {
    throw new Error('Role tidak ditemukan');
  }

  return rows[0];
};

const getRoleIdUserService = async () => {
  const roles = await Roles.findOne({
    where: { alias: 'USER' },
    attributes: ['id'],
  });
  return roles.id;
};

const updateRoleService = async (req, id) => {
  const userId = req.user.id;
  const now = new Date();
  const row = req.body;
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const dataRoles = {
      updated_at: now,
      updated_by: userId,
      is_active: row.isActive,
      name: row.name,
      alias: row.alias,
      description: row.description,
    };

    let alias = await generateAlias(dataRoles.alias);
    dataRoles.alias = alias;
    const checkAlias = await getCheckAlias(Roles, alias);

    if (checkAlias) {
      let newAlias = await generateNewAlias(Roles, dataRoles.alias);
      dataRoles.alias = newAlias;
    }

    await Roles.update(dataRoles, {
      where: { id: id },
      transaction,
    });

    const getList = await getRoleByIdService(id, transaction);

    await transaction.commit();
    return getList;
  } catch (error) {
    await transaction.rollback();
    console.log('Error in update role service: ', error.message);
    throw error;
  }
};

const deleteRoleService = async (req, id) => {
  const userId = req.user.id;
  const now = new Date();
  await Roles.update(
    { is_deleted: true, deleted_by: userId, deleted_at: now },
    { where: { id: id } }
  );

  return Roles.findOne({
    where: { id: id },
    attributes: ['id', 'name', 'is_deleted', 'is_deleted', 'deleted_at'],
  });
};

const getJsonRowRoleService = (data) => {
  const checkList = Array.isArray(data) ? 'array' : 'single';
  const dataArray = Array.isArray(data) ? data : [data];

  const json = dataArray.map((row) => ({
    id: row.id,
    createdAt: row.created_at,
    createdBy: row.created_at,
    isActive: row.is_active,
    name: row.name,
    alias: row.alias,
    description: row.description,
  }));

  if (checkList == 'array') {
    return json;
  } else {
    return convertArrayToSingleJson(json);
  }
};

module.exports = {
  createRoleService,
  getAllRolesService,
  getRoleByIdService,
  getRoleByIdUserService,
  getRoleIdUserService,
  updateRoleService,
  deleteRoleService,
  getJsonRowRoleService,
};
