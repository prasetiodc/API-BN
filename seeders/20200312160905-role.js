'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('tbl_roles', [{
      role: 'Admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      role: 'MD',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
   return queryInterface.bulkDelete('tbl_roles', null, {});

  }
};
