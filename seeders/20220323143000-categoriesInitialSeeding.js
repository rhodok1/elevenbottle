'use strict';

const fs = require('fs');

module.exports = {
  up (queryInterface, Sequelize) {
    let data = JSON.parse(fs.readFileSync('./data/categories.json', 'utf-8'))
    data = data.map(el => {
      el.createdAt = el.updatedAt = new Date()
      return el
    })
    return queryInterface.bulkInsert('Categories', data)
  },

  down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Categories', null)
  }
};
