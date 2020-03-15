'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('tbl_category_uploads', [{
      category: 'POG',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      category: 'Fixture Traits',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      category: 'Promotions',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      category: 'Visitation list/store list',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      category: 'Permit',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      category: 'Visit Instructions',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('tbl_category_uploads', null, {});
  }
};
