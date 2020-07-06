'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('tbl_visits', 'entryGoogle50KSpacing', Sequelize.DataTypes.INTEGER),
      queryInterface.addColumn('tbl_visits', 'entryGoogle100KSpacing', Sequelize.DataTypes.INTEGER),
      queryInterface.addColumn('tbl_visits', 'entryGoogle150KSpacing', Sequelize.DataTypes.INTEGER),
      queryInterface.addColumn('tbl_visits', 'entryGoogle300KSpacing', Sequelize.DataTypes.INTEGER),
      queryInterface.addColumn('tbl_visits', 'entryGoogle500KSpacing', Sequelize.DataTypes.INTEGER),
      queryInterface.addColumn('tbl_visits', 'exitGoogle50KSpacing', Sequelize.DataTypes.INTEGER),
      queryInterface.addColumn('tbl_visits', 'exitGoogle100KSpacing', Sequelize.DataTypes.INTEGER),
      queryInterface.addColumn('tbl_visits', 'exitGoogle150KSpacing', Sequelize.DataTypes.INTEGER),
      queryInterface.addColumn('tbl_visits', 'exitGoogle300KSpacing', Sequelize.DataTypes.INTEGER),
      queryInterface.addColumn('tbl_visits', 'exitGoogle500KSpacing', Sequelize.DataTypes.INTEGER),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('tbl_visits', 'entryGoogle50KSpacing'),
      queryInterface.removeColumn('tbl_visits', 'entryGoogle100KSpacing'),
      queryInterface.removeColumn('tbl_visits', 'entryGoogle150KSpacing'),
      queryInterface.removeColumn('tbl_visits', 'entryGoogle300KSpacing'),
      queryInterface.removeColumn('tbl_visits', 'entryGoogle500KSpacing'),
      queryInterface.removeColumn('tbl_visits', 'exitGoogle50KSpacing'),
      queryInterface.removeColumn('tbl_visits', 'exitGoogle100KSpacing'),
      queryInterface.removeColumn('tbl_visits', 'exitGoogle150KSpacing'),
      queryInterface.removeColumn('tbl_visits', 'exitGoogle300KSpacing'),
      queryInterface.removeColumn('tbl_visits', 'exitGoogle500KSpacing'),
    ])
  }
};
