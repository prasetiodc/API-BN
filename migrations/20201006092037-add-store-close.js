'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('tbl_visits', 'store_open', Sequelize.DataTypes.BOOLEAN)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('tbl_visits', 'store_open')
  }
};
