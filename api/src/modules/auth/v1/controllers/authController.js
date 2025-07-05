const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const constants = require('../../../../config/constants');
const sendResponse = require('../../../../utils/responseUtil');
const Users = require('../models/s_users');
const UserCookies = require('../models/s_user_cookies');
const UserLogs = require('../models/s_user_logs');
const {
  getRoleByIdUserService,
} = require('../../../master/v1/services/rolesService');
const generateUUID = require('../../../../utils/uuidUtil');

exports.login = async (req, res) => {
  const { account, device = 'web', password } = req.body;

  if (!account || !password) {
    return sendResponse(
      res,
      400,
      'error',
      'Harap mengisi akun dan kata sandi anda.'
    );
  }

  try {
    const user = await Users.findOne({
      where: {
        [Op.or]: [{ username: account }, { email: account }],
      },
    });

    if (!user) {
      return sendResponse(
        res,
        400,
        'error',
        'Email atau kata sandi tidak sesuai.'
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendResponse(
        res,
        400,
        'error',
        'Email atau kata sandi tidak sesuai'
      );
    }

    if (!user.is_active) {
      return sendResponse(
        res,
        403,
        'error',
        'Akun anda tidak aktif, silahkan lakukan aktivasi'
      );
    }

    let accessTokenExpiresIn = constants.JWT_TIME_DEFAULT;
    let refreshTokenExpiresIn = constants.JWT_REFRESH_TIME;

    const rowUser = await getRoleByIdUserService(user.id);
    const dataSign = {
      id: user.id,
      role_id: rowUser.roles.id,
      role_alias: rowUser.roles.alias,
      device: device,
    };

    const accessToken = jwt.sign(dataSign, constants.JWT_SECRET, {
      expiresIn: accessTokenExpiresIn,
    });

    const refreshToken = jwt.sign(dataSign, constants.JWT_SECRET, {
      expiresIn: refreshTokenExpiresIn,
    });

    const refreshTokenExpiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ); // 7 hari

    res.cookie('users_cookies', refreshToken, {
      httpOnly: false,
      secure: true,
    });

    // simpan access token dan refresh token di cookies
    await UserCookies.createUserCookie(
      generateUUID(),
      user.id,
      req.ip,
      accessToken,
      refreshToken,
      req.headers['user-agent'],
      refreshTokenExpiresAt
    );

    //
    await UserLogs.createUserLog(
      generateUUID(),
      user.id,
      user.username,
      req.ip,
      req.headers['user-agent'],
      'login',
      device,
      'Pengguna telah berhasil login'
    );

    return sendResponse(res, 200, 'success', 'Login berhasil', {
      id: user.id,
      username: user.username,
      email: user.email,
      telphone: user.telphone,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Error in auth login controller: ', error.message);
    return sendResponse(res, 500, 'error', 'Server error');
  }
};
