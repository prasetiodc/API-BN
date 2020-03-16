'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_visit_fixtures = sequelize.define('tbl_visit_fixtures', {
    fixture_type_id_1: DataTypes.INTEGER,
    fixture_type_id_2: DataTypes.INTEGER
  }, {});
  tbl_visit_fixtures.associate = function (models) {
    // associations can be defined here
    tbl_visit_fixtures.hasOne(models.tbl_visits, { foreignKey: 'visit_fixture_id' })
    tbl_visit_fixtures.belongsTo(models.tbl_fixture_types, { as: "fixtureType1", foreignKey: 'fixture_type_id_1' })
    tbl_visit_fixtures.belongsTo(models.tbl_fixture_types, { as: "fixtureType2", foreignKey: 'fixture_type_id_2' })
  };
  return tbl_visit_fixtures;
};