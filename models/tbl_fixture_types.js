'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_fixture_types = sequelize.define('tbl_fixture_types', {
    fixture_type: DataTypes.STRING,
    POG: DataTypes.STRING,
    fixture_traits: DataTypes.STRING,
    retailer_id: DataTypes.INTEGER,
    google_50k: DataTypes.INTEGER,
    google_100k: DataTypes.INTEGER,
    google_150k: DataTypes.INTEGER,
    google_300k: DataTypes.INTEGER,
    google_500k: DataTypes.INTEGER,
    spotify_1m: DataTypes.INTEGER,
    spotify_3m: DataTypes.INTEGER
  }, {});
  tbl_fixture_types.associate = function (models) {
    // associations can be defined here
    tbl_fixture_types.hasMany(models.tbl_stores, { as: "fixtureType1", foreignKey: 'fixture_type_id_1' })
    tbl_fixture_types.hasMany(models.tbl_stores, { as: "fixtureType2", foreignKey: 'fixture_type_id_2' })
    tbl_fixture_types.belongsTo(models.tbl_retailers, { foreignKey: 'retailer_id' })
    tbl_fixture_types.hasMany(models.tbl_visits, { foreignKey: 'entry_correct_fixture', as: 'entry_correct_fixture_id'})
    tbl_fixture_types.hasMany(models.tbl_visits, { foreignKey: 'exit_correct_fixture', as: 'exit_correct_fixture_id' })
  };
  return tbl_fixture_types;
};