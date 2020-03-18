'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_uploads = sequelize.define('tbl_uploads', {
    path: DataTypes.STRING,
    category_upload_id: DataTypes.INTEGER,
    retailer_id: DataTypes.INTEGER,
    information: DataTypes.STRING,
  }, {});
  tbl_uploads.associate = function (models) {
    // associations can be defined here
    tbl_uploads.belongsTo(models.tbl_category_uploads, { foreignKey: "category_upload_id" })
    tbl_uploads.belongsTo(models.tbl_retailers, { foreignKey: "retailer_id" })
  };
  return tbl_uploads;
};