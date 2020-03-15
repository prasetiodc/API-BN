'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_stores = sequelize.define('tbl_stores', {
    store_code: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    store_name: DataTypes.STRING,
    retailer_id: DataTypes.INTEGER,
    dc_id: DataTypes.INTEGER,
    address: DataTypes.STRING,
    sub_district: DataTypes.STRING,
    district: DataTypes.STRING,
    city: DataTypes.STRING
  }, {});
  tbl_stores.removeAttribute('id');

  tbl_stores.associate = function (models) {
    // associations can be defined here
    tbl_stores.hasMany(models.tbl_visits, {foreignKey: 'store_code'})
    tbl_stores.belongsTo(models.tbl_retailers, { foreignKey: 'retailer_id' })
    tbl_stores.belongsTo(models.tbl_dcs, { foreignKey: 'dc_id' })
  };
  return tbl_stores;
};