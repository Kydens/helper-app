const { DataTypes } = require('sequelize');
const sequelize = require('../../../../config/sequelize');

const Todolist = sequelize.define(
  'f_todolist',
  {
    id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    created_by: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_by: {
      type: DataTypes.STRING(36),
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
    is_finish: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    user_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    level: {
      type: DataTypes.ENUM(
        'Sangat Penting',
        'Cukup Penting',
        'Penting',
        'Tidak Penting'
      ),
      allowNull: false,
      defaultValue: 'Penting',
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: 'f_todolist',
    timestamps: false,
  }
);

module.exports = Todolist;
