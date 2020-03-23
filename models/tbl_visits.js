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
    entry_peg_comp: DataTypes.BOOLEAN,
    entry_pog_comp: DataTypes.BOOLEAN,
    entry_pop_pic_1: DataTypes.BOOLEAN,
    entry_pop_pic_2: DataTypes.BOOLEAN,
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
    exit_pop_pic_1: DataTypes.BOOLEAN,
    exit_pop_pic_2: DataTypes.BOOLEAN,
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
    q3: DataTypes.BOOLEAN,
    q4: DataTypes.BOOLEAN
  }, {});
  tbl_visits.removeAttribute('id');

  tbl_visits.associate = function (models) {
    // associations can be defined here
    tbl_visits.belongsTo(models.tbl_users, { foreignKey: 'user_id' })
    tbl_visits.belongsTo(models.tbl_stores, { foreignKey: 'store_code' })
  };
  return tbl_visits;
};