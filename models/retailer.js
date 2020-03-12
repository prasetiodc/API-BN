'use strict';
module.exports = (sequelize, DataTypes) => {
  const Retailer = sequelize.define('Retailer', {
    retailer_name: DataTypes.STRING,
    total_store: DataTypes.INTEGER
  }, {});
  Retailer.associate = function (models) {
    // associations can be defined here
    Retailer.hasMany(models.Store, { foreignKey: 'retailer_id' })
  };
  return Retailer;
};