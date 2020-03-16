'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_visit_fixtures = sequelize.define('tbl_visit_fixtures', {
    visit_id: DataTypes.INTEGER,
    fixture_type_id_1: DataTypes.INTEGER,
    fixture_type_id_2: DataTypes.INTEGER
  }, {});
  tbl_visit_fixtures.associate = function(models) {
    // associations can be defined here
  };
  return tbl_visit_fixtures;
};