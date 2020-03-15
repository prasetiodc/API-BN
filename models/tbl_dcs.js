'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_dcs = sequelize.define('tbl_dcs', {
    DC_name: DataTypes.STRING
  }, {});
  tbl_dcs.associate = function(models) {
    // associations can be defined here
    tbl_dcs.hasMany(models.tbl_stores, { foreignKey: 'dc_id' })
  };
  return tbl_dcs;
};