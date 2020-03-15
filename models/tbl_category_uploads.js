'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_category_uploads = sequelize.define('tbl_category_uploads', {
    category: DataTypes.STRING
  }, {});
  tbl_category_uploads.associate = function(models) {
    // associations can be defined here
    tbl_category_uploads.hasMany(models.tbl_uploads, {foreignKey: "category_upload_id"})
  };
  return tbl_category_uploads;
};