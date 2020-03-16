'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_notifications = sequelize.define('tbl_notifications', {
    message: DataTypes.STRING,
    path_file: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    read: DataTypes.BOOLEAN
  }, {});
  tbl_notifications.associate = function(models) {
    // associations can be defined here
  };
  return tbl_notifications;
};