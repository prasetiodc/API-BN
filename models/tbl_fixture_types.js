'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_fixture_types = sequelize.define('tbl_fixture_types', {
    fixture_type: DataTypes.STRING,
    google_50k: DataTypes.INTEGER,
    google_100k: DataTypes.INTEGER,
    google_150k: DataTypes.INTEGER,
    google_300k: DataTypes.INTEGER,
    google_500k: DataTypes.INTEGER,
    spotify_1m: DataTypes.INTEGER,
    spotify_3m: DataTypes.INTEGER
  }, {});
  tbl_fixture_types.associate = function(models) {
    // associations can be defined here
    tbl_fixture_types.hasMany(models.tbl_visit_fixtures, { as: "fixtureType1", foreignKey: 'fixture_type_id_1' })
    tbl_fixture_types.hasMany(models.tbl_visit_fixtures, { as: "fixtureType2", foreignKey: 'fixture_type_id_2' })
            // tbl_users.hasMany(models.tbl_contacts, { as: "evaluator1", foreignKey: "evaluator_1" })
  };
  return tbl_fixture_types;
};