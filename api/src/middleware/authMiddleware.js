const jwt = require('jsonwebtoken');
const redis = require('../config/redis');
const sendResponse = require('../utils/responseUtil');
const constants = require('../config/constants');
const Users = require('../modules/auth/v1/models/users');
const UserCookies = require('../modules/auth/v1/models/user_cookies');

let redisAvailable = true;

redis.on('error', () => (redisAvailable = false));
redis.on('connect', () => (redisAvailable = true));

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return sendResponse(res, 401, 'error', 'Token tidak ditemukan');
    }

    let decodedUser;
    try {
      decodedUser = await jwt.verify(token, constants.JWT_SECRET);
    } catch (err) {
      return sendResponse(
        res,
        401,
        'error',
        'Token tidak valid atau sudah kedaluwarsa'
      );
    }

    const userId = decodedUser.id;
    const redisKey = `user_auth:${userId}`;

    let userData;

    if (redisAvailable) {
      const cachedData = await redis.get(redisKey);
      if (cachedData) {
        userData = JSON.parse(cachedData);
      }
    }

    if (!userData) {
      const user = await Users.findOne({
        where: { id: userId },
      });

      if (!user || !user.is_active || user.is_deleted) {
        if (redisAvailable) {
          await redis.del(redisKey);
        }

        return sendResponse(res, 403, 'error', 'Akun anda telah dinonaktifkan');
      }

      userData = { is_active: true };

      if (redisAvailable) {
        await redis.setex(redisKey, 3600, JSON.stringify(userData));
      }
    }

    req.user = {
      id: decodedUser.id,
      role_id: decodedUser.role_id,
      role_alias: decodedUser.role_alias,
      device: decodedUser.device,
      is_admin: decodedUser.is_admin,
    };

    return next();
  } catch (error) {
    console.error('Error in authMiddleware: ', error.message);
    if (!res.headersSent) {
      return sendResponse(res, 500, 'error', 'Terjadi kesalahan pada server');
    }
  }
};

module.exports = authMiddleware;
