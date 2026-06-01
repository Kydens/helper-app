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

exports.refreshToken = async (req, res) => {
  // console.log('req: ', req);
  console.log('req.cookies: ', req.cookies);
  const refreshToken = req.cookies.refresh_token;
  console.log('refresh_token: ', refreshToken);

  if (!refreshToken) {
    return sendResponse(
      res,
      403,
      'error',
      'Anda tidak memiliki akses, silahkan login kembali.'
    );
  }

  try {
    // cek refresh token di db
    const userCookie = await UserCookies.findOne({
      where: {
        refresh_token: refreshToken,
        is_active: true,
      },
    });

    if (!userCookie) {
      return sendResponse(
        res,
        403,
        'error',
        'Refresh token tidak valid atau sudah dihapus.'
      );
    }

    // cek token by db

    if (new Date() > new Date(userCookie.expired_at)) {
      await UserCookies.update(
        { is_active: false },
        { where: { id: userCookie.id } }
      );
      return sendResponse(
        res,
        403,
        'error',
        'Sesi anda telah berakhir, silahkan login kembali.'
      );
    }

    // cek token by jwt
    let decoded;
    try {
      decoded = jwt.verify(userCookie.refresh_token, constants.JWT_SECRET);
    } catch (error) {
      await UserCookies.update(
        { is_active: false },
        { where: { id: userCookie.id } }
      );

      return sendResponse(
        res,
        403,
        'error',
        'Sesi anda telah berakhir, silahkan login kembali.'
      );
    }

    const user = await Users.findOne({
      where: {
        id: userCookie.user_id,
      },
    });

    const rowUser = await getRoleByIdUserService(user.id);

    const dataSign = {
      id: user.id,
      username: user.username,
      role_id: rowUser.roles.id,
      role_alias: rowUser.roles.alias,
      device: 'web',
    };

    let accessTokenExpiresIn = constants.JWT_TIME_DEFAULT;
    const accessToken = jwt.sign(dataSign, constants.JWT_SECRET, {
      expiresIn: accessTokenExpiresIn,
    });

    return sendResponse(res, 200, 'success', 'Refresh token berhasil.', {
      accessToken: accessToken,
      userId: user.id,
      username: user.username,
      role_alias: rowUser.roles.alias,
    });
  } catch (error) {
    console.error('Error in auth refresh token controller');
    return sendResponse(res, 500, 'error', 'Server error', error.message);
  }
};

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
      username: user.username,
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
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ); // 1 bulan

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: constants.MODE === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // simpan access token dan refresh token di cookies
    await UserCookies.createUserCookie(
      generateUUID(),
      user.id,
      req.ip,
      refreshToken,
      String(req.headers['user-agent']),
      refreshTokenExpiresAt
    );

    //
    await UserLogs.createUserLog(
      generateUUID(),
      user.id,
      user.username,
      req.ip,
      String(req.headers['user-agent']),
      'login',
      device,
      'Pengguna telah berhasil login'
    );

    return sendResponse(res, 200, 'success', 'Login berhasil', {
      id: user.id,
      username: user.username,
      role_alias: rowUser.roles.alias,
      accessToken: accessToken,
    });
  } catch (error) {
    console.error('Error in auth login controller: ', error.message);
    return sendResponse(res, 500, 'error', 'Server error');
  }
};

exports.logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      return sendResponse(
        res,
        403,
        'error',
        'Anda tidak memiliki akses, silahkan login kembali.'
      );
    }

    await UserCookies.update(
      { is_active: false },
      { where: { refresh_token: refreshToken } }
    );

    res.cookie('refresh_token', '', {
      httpOnly: true,
      secure: constants.MODE === 'production',
      sameSite: 'lax',
      maxAge: -1,
    });

    return sendResponse(res, 200, 'success', 'Logout Berhasil!');
  } catch (error) {
    console.error('Error in auth logout controller', error.message);
    return sendResponse(res, 500, 'error', 'Server error');
  }
};
