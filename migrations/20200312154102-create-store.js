'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Stores', {
      store_code: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(50)
      },
      store_name: {
        type: Sequelize.STRING(50)
      },
      retailer_id: {
        type: Sequelize.INTEGER(11)
      },
      dc: {
        type: Sequelize.STRING(50)
      },
      address: {
        type: Sequelize.STRING(255)
      },
      sub_district: {
        type: Sequelize.STRING(50)
      },
      district: {
        type: Sequelize.STRING(50)
      },
      city: {
        type: Sequelize.STRING(50)
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
    return queryInterface.dropTable('Stores');
  }
};