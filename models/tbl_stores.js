'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_stores = sequelize.define('tbl_stores', {
    store_code: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    store_name: DataTypes.STRING,
    md_id: DataTypes.INTEGER,
    retailer_id: DataTypes.INTEGER,
    dc_id: DataTypes.INTEGER,
    fixture_type_id_1: DataTypes.INTEGER,
    fixture_type_id_2: DataTypes.INTEGER,
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
    tbl_stores.belongsTo(models.tbl_users, { foreignKey: 'md_id' })
    tbl_stores.belongsTo(models.tbl_fixture_types, { as: "fixtureType1", foreignKey: 'fixture_type_id_1' })
    tbl_stores.belongsTo(models.tbl_fixture_types, { as: "fixtureType2", foreignKey: 'fixture_type_id_2' })
  };
  return tbl_stores;
};