'use strict';
const { hash } = require('../helpers/bcrypt')

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    let data = []

    for (let i = 1; i <= 50; i++) {

      let id
      if (i < 10) {
        id = `00${i}`
      } else {
        id = `0${i}`
      }

      let newObj = {
        nik: `BHN${id}`,
        name: `BHN${id}`,
        email: `BHN${id}@gmail.com`,
        password: hash('BHN123'),
        role_id: 2,
      }
      data.push(newObj)
    }

    return queryInterface.bulkInsert('tbl_users', data, {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
    return queryInterface.bulkDelete('tbl_users', null, {});
  }
};
