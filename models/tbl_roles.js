'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_roles = sequelize.define('tbl_roles', {
    role: DataTypes.STRING
  }, {});
  tbl_roles.associate = function (models) {
    // associations can be defined here
    tbl_roles.hasMany(models.tbl_users, { foreignKey: 'role_id' })
  };
  return tbl_roles;
};