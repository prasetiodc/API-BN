'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Visits', {
      id_visit: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(11)
      },
      img_store: {
        type: Sequelize.STRING(255)
      },
      img_fixture_in: {
        type: Sequelize.STRING(255)
      },
      img_fixture_out: {
        type: Sequelize.STRING(255)
      },
      visit_date: {
        type: Sequelize.DATE
      },
      user_id: {
        type: Sequelize.INTEGER(11)
      },
      store_code: {
        type: Sequelize.STRING(50)
      },
      entry_fixture_comp: {
        type: Sequelize.BOOLEAN
      },
      entry_peg_comp: {
        type: Sequelize.BOOLEAN
      },
      entry_pog_comp: {
        type: Sequelize.BOOLEAN
      },
      entry_google50k: {
        type: Sequelize.BOOLEAN
      },
      entry_google100k: {
        type: Sequelize.BOOLEAN
      },
      entry_google150k: {
        type: Sequelize.BOOLEAN
      },
      entry_google300k: {
        type: Sequelize.BOOLEAN
      },
      entry_google500k: {
        type: Sequelize.BOOLEAN
      },
      entry_spotify1M: {
        type: Sequelize.BOOLEAN
      },
      entry_spotify3M: {
        type: Sequelize.BOOLEAN
      },
      exit_fixture_comp: {
        type: Sequelize.BOOLEAN
      },
      exit_peg_comp: {
        type: Sequelize.BOOLEAN
      },
      exit_pog_comp: {
        type: Sequelize.BOOLEAN
      },
      exit_google50k: {
        type: Sequelize.BOOLEAN
      },
      exit_google100k: {
        type: Sequelize.BOOLEAN
      },
      exit_google150k: {
        type: Sequelize.BOOLEAN
      },
      exit_google300k: {
        type: Sequelize.BOOLEAN
      },
      exit_google500k: {
        type: Sequelize.BOOLEAN
      },
      exit_spotify1M: {
        type: Sequelize.BOOLEAN
      },
      exit_spotify3M: {
        type: Sequelize.BOOLEAN
      },
      assistants_name: {
        type: Sequelize.STRING(30)
      },
      q1: {
        type: Sequelize.BOOLEAN
      },
      q2: {
        type: Sequelize.BOOLEAN
      },
      q3: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Visits');
  }
};