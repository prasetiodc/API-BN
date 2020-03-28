'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_retailers = sequelize.define('tbl_retailers', {
    retailer_name: DataTypes.STRING,
    initial: DataTypes.STRING,
    promotion_1: DataTypes.STRING,
    promotion_2: DataTypes.STRING,
    total_store: DataTypes.INTEGER
  }, {});
  tbl_retailers.associate = function (models) {
    // associations can be defined here
    tbl_retailers.hasMany(models.tbl_stores, { foreignKey: 'retailer_id' })
    tbl_retailers.hasMany(models.tbl_uploads, { foreignKey: 'retailer_id' })
    tbl_retailers.hasMany(models.tbl_fixture_types, { foreignKey: 'retailer_id' })
  };
  return tbl_retailers;
};