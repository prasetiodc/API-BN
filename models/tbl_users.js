'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_users = sequelize.define('tbl_users', {
    nik: DataTypes.STRING,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role_id: DataTypes.INTEGER,
    login_date: DataTypes.DATE
  }, {});
  tbl_users.associate = function (models) {
    // // associations can be defined here
    tbl_users.hasMany(models.tbl_visits, { foreignKey: 'user_id' })
    tbl_users.hasMany(models.tbl_stores, { foreignKey: 'md_id' })
    tbl_users.belongsTo(models.tbl_roles, { foreignKey: 'role_id' })
  };
  return tbl_users;
};