const jwt = require("jsonwebtoken");
const redis = require("../config/redis");
const sendResponse = require("../utils/responseUtil");
const constants = require("../config/constants");
const Users = require("../modules/auth/v1/models/s_users");
const UserCookies = require("../modules/auth/v1/models/s_user_cookies");

let redisAvailable = true;

redis.on("error", () => (redisAvailable = false));
redis.on("connect", () => (redisAvailable = true));

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return sendResponse(res, 400, "error", "Token tidak ditemukan");
    }

    let decodedUser;

    try {
      decodedUser = await jwt.verify(token, constants.JWT_SECRET);
    } catch (err) {
      return sendResponse(
        res,
        400,
        "error",
        "Token tidak valid atau sudah kedaluwarsa"
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

        return sendResponse(res, 403, "error", "Akun anda telah dinonaktifkan");
      }

      const userCookie = await UserCookies.findOne({
        where: { access_token: token },
      });

      if (!userCookie)
        return sendResponse(res, 403, "error", "Session tidak valid!");

      if (!userCookie.is_active) {
        if (redisAvailable) {
          await redis.del(redisKey);
        }

        return sendResponse(res, 403, "error", "Akses token dibanned");
      }

      let refreshDecoded;
      try {
        refreshDecoded = await jwt.verify(
          userCookie.refresh_token,
          constants.JWT_SECRET
        );
      } catch (refreshError) {
        console.error("Refresh token kedaluwarsa: ", refreshError.message);

        await UserCookies.update(
          { is_active: 0 },
          { where: { refresh_token: userCookie.refresh_token } }
        );

        if (redisAvailable) {
          await redis.del(redisKey);
        }

        return sendResponse(
          res,
          403,
          "error",
          "Refresh token kedaluwarsa, akun dinonaktifkan. Silahkan login kembali."
        );
      }

      userData = { is_active: true };
    }

    if (!userData.is_active) {
      return sendResponse(res, 403, "error", "Akun anda telah dinonaktifkan");
    }

    if (redisAvailable) {
      await redis.setex(redisKey, 3600, JSON.stringify(userData));
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
    console.error("Error in authMiddleware: ", error.message);
    if (!res.headersSent) {
      return sendResponse(res, 500, "error", "Terjadi kesalahan pada server");
    }
  }
};

module.exports = authMiddleware;
