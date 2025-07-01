const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/sequelize");

const UserCookies = sequelize.define(
  "UserCookies",
  {
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ip_address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    browser: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    access_token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    refresh_token: {
      type: DataTypes.STRING,
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
    tableName: "s_users_cookies",
    timestamps: false,
  }
);

// Menambahkan metode statis untuk membuat UserCookie
UserCookies.createUserCookie = async function (
  userId,
  ipAddress,
  token,
  refresh_token,
  userAgent,
  expiredAt
) {
  return await UserCookies.create({
    user_id: userId,
    ip_address: ipAddress,
    access_token: token,
    refresh_token: refresh_token,
    browser: userAgent,
    expired_at: expiredAt,
  });
};

module.exports = UserCookies;
