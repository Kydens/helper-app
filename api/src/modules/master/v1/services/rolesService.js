const pool = require('../../../../config/database');
const Roles = require('../models/s_roles');
const {
  generateAlias,
  getCheckAlias,
  generateNewAlias,
  convertArrayToSingleJson,
} = require('../../../../utils/utils');
const generateUUID = require('../../../../utils/uuidUtil');
const { insertTransaction } = require('../../../../utils/crudUtil');

let tableDB = 's_roles';

const createRoleService = async (req) => {
  const client = await pool.connect();
  const userId = req.user.id;
  const now = new Date();
  const row = req.body;
  try {
    await client.query('BEGIN');

    const rowDataRole = {
      id: generateUUID(),
      created_at: now,
      created_by: userId,
      is_active: row.is_active,
      name: row.name,
      alias: row.alias,
      description: row.description,
    };

    let alias = await generateAlias(rowDataRole.alias);
    rowDataRole.alias = alias;
    const checkAlias = await getCheckAlias(client, tableDB, alias);

    if (checkAlias) {
      let newAlias = await generateNewAlias(client, tableDB, rowDataRole.alias);
      rowDataRole.alias = newAlias;
    }

    const rowRole = await insertTransaction(client, tableDB, rowDataRole, '*');

    await client.query('COMMIT');
    return rowRole;
  } catch (error) {
    await client.query('ROLLBACK');
    console.log('Error in createRoleService: ', error.message);
    throw error;
  } finally {
    client.release();
  }
};

const getAllRoleService = async () => {
  return (roles = await Roles.findAll());
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
  return rows[0];
};

const getRoleIdUserService = async () => {
  const roles = await Roles.findOne({ where: { alias: 'USER' } });
  return roles.id;
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
  getAllRoleService,
  getRoleByIdUserService,
  getRoleIdUserService,
  getJsonRowRoleService,
};
