'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('tbl_fixture_types', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fixture_type: {
        type: Sequelize.STRING
      },
      POG: {
        type: Sequelize.STRING(255)
      },
      fixture_traits: {
        type: Sequelize.STRING(255)
      },
      google_50k: {
        type: Sequelize.INTEGER
      },
      google_100k: {
        type: Sequelize.INTEGER
      },
      google_150k: {
        type: Sequelize.INTEGER
      },
      google_300k: {
        type: Sequelize.INTEGER
      },
      google_500k: {
        type: Sequelize.INTEGER
      },
      spotify_1m: {
        type: Sequelize.INTEGER
      },
      spotify_3m: {
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('tbl_fixture_types');
  }
};