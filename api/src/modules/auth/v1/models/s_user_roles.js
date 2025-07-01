const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/sequelize");

const UserRoles = sequelize.define(
  "s_user_roles",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    created_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deleted_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    user_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    role_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
  },
  {
    tableName: "s_user_roles",
    timestamps: false,
  }
);

module.exports = UserRoles;
