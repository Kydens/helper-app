const { DataTypes } = require('sequelize');
const sequelize = require('../../../../config/sequelize');

const UserLogs = sequelize.define(
  'UserLogs',
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
    username: {
      type: DataTypes.STRING,
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
    status_logs: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    device: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 's_users_logs',
    timestamps: false,
  }
);

// Menambahkan metode statis untuk membuat UserLog
UserLogs.createUserLog = async function (
  id,
  userId,
  username,
  ipAddress,
  userAgent,
  statusLogs,
  device,
  description
) {
  return await UserLogs.create({
    id: id,
    user_id: userId,
    username: username,
    ip_address: ipAddress,
    browser: userAgent,
    status_logs: statusLogs,
    device: device,
    description: description,
  });
};

module.exports = UserLogs;
