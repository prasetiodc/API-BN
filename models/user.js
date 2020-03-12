'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    nik: DataTypes.STRING,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role_id: DataTypes.INTEGER,
    login_date: DataTypes.DATE
  }, {});
  User.associate = function (models) {
    // // associations can be defined here
    User.hasMany(models.Visit, { foreignKey: 'user_id' })
    User.belongsTo(models.Role, { foreignKey: 'role_id' })

  };
  return User;
};