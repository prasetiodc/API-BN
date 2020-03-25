'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('tbl_retailers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(11)
      },
      retailer_name: {
        type: Sequelize.STRING(50)
      },
      initial: {
        type: Sequelize.STRING(20)
      },
      promotion_1: {
        type: Sequelize.STRING(255)
      },
      promotion_2: {
        type: Sequelize.STRING(255)
      },
      total_store: {
        type: Sequelize.INTEGER(100)
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
    return queryInterface.dropTable('tbl_retailers');
  }
};