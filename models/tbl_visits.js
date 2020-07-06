'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_visits = sequelize.define('tbl_visits', {
    id_visit: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    img_store: DataTypes.STRING,
    img_fixture_in: DataTypes.STRING,
    img_fixture_out: DataTypes.STRING,
    visit_date: DataTypes.DATE,
    user_id: DataTypes.INTEGER,
    store_code: DataTypes.STRING,
    entry_fixture_comp: DataTypes.BOOLEAN,
    entry_correct_fixture: DataTypes.INTEGER,
    entry_peg_comp: DataTypes.BOOLEAN,
    entry_broken_hanger: DataTypes.INTEGER,
    entry_pog_comp: DataTypes.BOOLEAN,
    entry_correct_pog: DataTypes.STRING,
    entry_pop_pic_1: DataTypes.BOOLEAN,
    entry_pop_pic_2: DataTypes.BOOLEAN,
    entry_google50k: DataTypes.INTEGER,
    entry_google100k: DataTypes.INTEGER,
    entry_google150k: DataTypes.INTEGER,
    entry_google300k: DataTypes.INTEGER,
    entry_google500k: DataTypes.INTEGER,
    entry_spotify1M: DataTypes.INTEGER,
    entry_spotify3M: DataTypes.INTEGER,
    exit_fixture_comp: DataTypes.BOOLEAN,
    exit_correct_fixture: DataTypes.INTEGER,
    exit_peg_comp: DataTypes.BOOLEAN,
    exit_broken_hanger: DataTypes.INTEGER,
    exit_pog_comp: DataTypes.BOOLEAN,
    exit_correct_pog: DataTypes.STRING,
    exit_pop_pic_1: DataTypes.BOOLEAN,
    exit_pop_pic_2: DataTypes.BOOLEAN,
    exit_google50k: DataTypes.INTEGER,
    exit_google100k: DataTypes.INTEGER,
    exit_google150k: DataTypes.INTEGER,
    exit_google300k: DataTypes.INTEGER,
    exit_google500k: DataTypes.INTEGER,
    exit_spotify1M: DataTypes.INTEGER,
    exit_spotify3M: DataTypes.INTEGER,
    assistants_name: DataTypes.STRING,
    q1: DataTypes.BOOLEAN,
    q2: DataTypes.BOOLEAN,
    q3: DataTypes.BOOLEAN,
    q4: DataTypes.BOOLEAN,
    entryGoogle50KSpacing: DataTypes.INTEGER,
    entryGoogle100KSpacing: DataTypes.INTEGER,
    entryGoogle150KSpacing: DataTypes.INTEGER,
    entryGoogle300KSpacing: DataTypes.INTEGER,
    entryGoogle500KSpacing: DataTypes.INTEGER,
    exitGoogle50KSpacing: DataTypes.INTEGER,
    exitGoogle100KSpacing: DataTypes.INTEGER,
    exitGoogle150KSpacing: DataTypes.INTEGER,
    exitGoogle300KSpacing: DataTypes.INTEGER,
    exitGoogle500KSpacing: DataTypes.INTEGER,
  }, {});
  tbl_visits.removeAttribute('id');

  tbl_visits.associate = function (models) {
    // associations can be defined here
    tbl_visits.belongsTo(models.tbl_users, { foreignKey: 'user_id' })
    tbl_visits.belongsTo(models.tbl_stores, { foreignKey: 'store_code' })
    tbl_visits.belongsTo(models.tbl_fixture_types, { foreignKey: 'entry_correct_fixture', as: 'entry_correct_fixture_id' })
    tbl_visits.belongsTo(models.tbl_fixture_types, { foreignKey: 'exit_correct_fixture', as: 'exit_correct_fixture_id' })
  };
  return tbl_visits;
};