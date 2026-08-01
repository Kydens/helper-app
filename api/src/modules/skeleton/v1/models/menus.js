const { DataTypes } = require('sequelize');
const sequelize = require('../../../../config/sequelize');

const Menus = sequelize.define(
  'menus',
  {
    id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      primaryKey: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    created_by: {
      type: DataTypes.STRING,
      allowNull: false,
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
      defaultValue: true,
    },
    menu_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    part_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role_alias: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNUll: false,
      defaultValue: ['USER'],
    },
    url_content: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'menus',
    schema: 'skeleton',
    timestamps: false,
  }
);

module.exports = Menus;
