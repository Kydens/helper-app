const { DataTypes } = require('sequelize');
const sequelize = require('../../../../config/sequelize');

const UserCookies = sequelize.define(
  'UserCookies',
  {
    id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    ip_address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    browser: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    refresh_token: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    expired_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'user_cookies',
    schema: 'master_data',
    timestamps: false,
  }
);

// Menambahkan metode statis untuk membuat UserCookie
UserCookies.createUserCookie = async function (
  id,
  userId,
  ipAddress,
  refresh_token,
  userAgent,
  expiredAt
) {
  return await UserCookies.create({
    id: id,
    user_id: userId,
    ip_address: ipAddress,
    refresh_token: refresh_token,
    browser: userAgent,
    expired_at: expiredAt,
  });
};

module.exports = UserCookies;
