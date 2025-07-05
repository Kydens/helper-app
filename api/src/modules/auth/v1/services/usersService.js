const bcrypt = require('bcrypt');
const pool = require('../../../../config/database');
const constants = require('../../../../config/constants');
const generateUUID = require('../../../../utils/uuidUtil');
const {
  insertTransaction,
  updateTransaction,
} = require('../../../../utils/crudUtil');
const { convertArrayToSingleJson } = require('../../../../utils/utils');
const Users = require('../models/s_users');
const {
  getRoleIdUserService,
} = require('../../../master/v1/services/rolesService');

const tableDB = 's_users';

const createUserService = async (req) => {
  const roleUser = await getRoleIdUserService();
  const client = await pool.connect();
  const now = new Date();
  const row = req.body;

  try {
    await client.query('BEGIN');

    let hashedPassword = null;
    if (row.password) {
      if (row.password.length < 8)
        throw new Error('Password minimal 8 karakter!');

      hashedPassword = await bcrypt.hash(
        row.password,
        parseInt(constants.SALT_ROUNDS)
      );
    }

    const rowDataUser = {
      id: generateUUID(),
      created_at: now,
      username: row.username,
      fullname: row.username, // saat signup, fullname set dari username
      email: row.email,
      password: hashedPassword,
      is_active: true, // sementara dibuat true yaa
    };

    // Cek apakah ada username atau email sudah terpakai
    const { rows: userExisted } = await client.query(
      `
      SELECT id FROM ${tableDB}
      WHERE username = $1 OR email = $2
      `,
      [rowDataUser.email, rowDataUser.username]
    );

    if (userExisted[0]) throw new Error('Username atau Email sudah terpakai.');

    const rowUser = await insertTransaction(client, tableDB, rowDataUser, '*');

    const userId = rowUser.id;
    const additionalData = [
      {
        table: 's_user_roles',
        data: {
          id: generateUUID(),
          created_by: userId,
          created_at: now,
          is_active: true,
          user_id: userId,
          role_id: roleUser,
        },
      },
    ];

    const rowAdditional = await Promise.all(
      additionalData.map((item) =>
        insertTransaction(client, item.table, item.data, 'id')
      )
    );

    await client.query('COMMIT');
    return rowUser;
  } catch (error) {
    await client.query('ROLLBACK');
    console.log('Error in createUserService: ', error.message);
    throw error;
  } finally {
    client.release();
  }
};

const getAllUsersService = async (
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
      { title: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } },
    ];
  }

  if (startDate && endDate) {
    whereClause.created_at = {
      [Op.between]: [startDate, endDate],
    };
  }

  const { count, rows } = await Users.findAndCountAll({
    where: whereClause,
    limit: parseInt(size),
    offset: parseInt(offset),
    order: [[sortBy, sortOrder.toUpperCase()]],
  });

  return { data: rows, total: count };
};

const getUserByIdService = async (id) => {
  let query = `
      SELECT * FROM ${tableDB}
      WHERE id = $1
    `;

  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

const getJsonRowUserService = (data) => {
  const checkList = Array.isArray(data) ? 'array' : 'tunggal';
  const dataArray = Array.isArray(data) ? data : [data];

  const json = dataArray.map((row) => ({
    id: row.id,
    createdAt: row.created_at,
    createdBy: row.created_by,
    isActive: row.is_active,
    username: row.username,
    email: row.email,
    fullname: row.fullname,
    telphone: row.telphone,
    isVerifyEmail: row.is_verify_email,
    verifyEmailDate: row.verify_email_date,
  }));

  if (checkList == 'array') {
    return json;
  } else {
    return convertArrayToSingleJson(json);
  }
};

module.exports = {
  createUserService,
  getAllUsersService,
  getUserByIdService,
  getJsonRowUserService,
};
