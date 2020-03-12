'use strict';
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    role: DataTypes.STRING
  }, {});
  Role.associate = function (models) {
    // associations can be defined here
    Role.hasMany(models.User, { foreignKey: 'role_id' })
  };
  return Role;
};