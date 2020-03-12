'use strict';
module.exports = (sequelize, DataTypes) => {
  const Visit = sequelize.define('Visit', {
    id_visit: DataTypes.INTEGER,
    img_store: DataTypes.STRING,
    img_fixture_in: DataTypes.STRING,
    img_fixture_out: DataTypes.STRING,
    visit_date: DataTypes.DATE,
    user_id: DataTypes.INTEGER,
    store_code: DataTypes.STRING,
    entry_fixture_comp: DataTypes.BOOLEAN,
    entry_peg_comp: DataTypes.BOOLEAN,
    entry_pog_comp: DataTypes.BOOLEAN,
    entry_google50k: DataTypes.BOOLEAN,
    entry_google100k: DataTypes.BOOLEAN,
    entry_google150k: DataTypes.BOOLEAN,
    entry_google300k: DataTypes.BOOLEAN,
    entry_google500k: DataTypes.BOOLEAN,
    entry_spotify1M: DataTypes.BOOLEAN,
    entry_spotify3M: DataTypes.BOOLEAN,
    exit_fixture_comp: DataTypes.BOOLEAN,
    exit_peg_comp: DataTypes.BOOLEAN,
    exit_pog_comp: DataTypes.BOOLEAN,
    exit_google50k: DataTypes.BOOLEAN,
    exit_google100k: DataTypes.BOOLEAN,
    exit_google150k: DataTypes.BOOLEAN,
    exit_google300k: DataTypes.BOOLEAN,
    exit_google500k: DataTypes.BOOLEAN,
    exit_spotify1M: DataTypes.BOOLEAN,
    exit_spotify3M: DataTypes.BOOLEAN,
    assistants_name: DataTypes.STRING,
    q1: DataTypes.BOOLEAN,
    q2: DataTypes.BOOLEAN,
    q3: DataTypes.BOOLEAN
  }, {});
  Visit.removeAttribute('id');

  Visit.associate = function (models) {
    // associations can be defined here
    Visit.belongsTo(models.User, { foreignKey: 'user_id' })
    // Visit.belongsTo(models.Store)
  };
  return Visit;
};