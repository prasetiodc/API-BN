'use strict';
module.exports = (sequelize, DataTypes) => {
  const Store = sequelize.define('Store', {
    store_code: DataTypes.STRING,
    store_name: DataTypes.STRING,
    retailer_id: DataTypes.INTEGER,
    dc: DataTypes.STRING,
    address: DataTypes.STRING,
    sub_district: DataTypes.STRING,
    district: DataTypes.STRING,
    city: DataTypes.STRING
  }, {});
  Store.removeAttribute('id');

  Store.associate = function (models) {
    // associations can be defined here
    // Store.hasMany(models.Visit)
    Store.hasMany(models.Visit, {foreignKey : "SubjectId"})
    Store.belongsTo(models.Retailer, { foreignKey: 'retailer_id' })
  };
  return Store;
};