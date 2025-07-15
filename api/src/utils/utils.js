const jwt = require('jsonwebtoken');
const constants = require('../config/constants');
const { where } = require('sequelize');

const isNotEmpty = (variable) => {
  return variable !== null && variable !== undefined && variable !== '';
};

const isEmptyString = (variable) => {
  return typeof variable === 'string' && variable.trim() === '';
};

const convertArrayToSingleJson = (dataArray) => {
  if (!Array.isArray(dataArray) || dataArray.length === 0) {
    throw new Error('Input harus berupa array yang tidak kosong');
  }

  return dataArray[0];
};

const getUserIdFromToken = (req) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) throw new Error('Authorization header is missing!');

  // ambil token setelah bearer
  const token = authHeader.split(' ')[1];

  if (!token) throw new Error('Token is missing!');

  try {
    const decodedUser = jwt.verify(token, constants.JWT_SECRET);

    return decodedUser.id;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

const checkIsAdmin = (req) => {
  if (!req.user) throw new Error('Tidak ada data user');

  if (req.user.role_alias === 'ADMIN') return true;

  return false;
};

const generateAlias = (text) => {
  return text
    .toUpperCase() // Ubah ke huruf besar
    .trim() // Hapus spasi di awal & akhir
    .replace(/[^A-Z0-9\s_]/g, '') // Hapus karakter spesial kecuali spasi & tanda hubung
    .replace(/\s+/g, '_') // Ganti spasi dengan garis bawah
    .replace(/_+/g, '_'); // Hilangkan garis bawah ganda
};

const getCheckAlias = async (table, alias) => {
  const rowAlias = await table.findOne({
    where: { alias: alias, is_active: true, is_deleted: false },
    attributes: ['alias'],
  });

  return rowAlias;
};

const generateNewAlias = async (table, text) => {
  let baseAlias;
  let counter = 1;

  // Cek ada angka di akhir alias
  const match = text.match(/^(.*?)(?:_(\d+))?$/);

  if (match) {
    baseAlias = generateAlias(match[1]); // Gunakan bagian sebelum angka sebagai base alias
    if (match[2]) {
      counter = parseInt(match[2], 10) + 1; // Gunakan angka yang sudah ada dan naikkan
    }
  } else {
    baseAlias = generateAlias(text);
  }

  let alias = baseAlias;
  let exists = await getCheckAlias(table, alias);

  while (exists) {
    alias = `${baseAlias}_${counter}`;
    exists = await getCheckAlias(table, alias);

    counter++;
  }

  return alias;
};

module.exports = {
  checkIsAdmin,
  isNotEmpty,
  isEmptyString,
  convertArrayToSingleJson,
  getUserIdFromToken,
  generateAlias,
  getCheckAlias,
  generateNewAlias,
};
