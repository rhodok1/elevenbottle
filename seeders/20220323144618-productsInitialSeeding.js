'use strict';

const fs = require('fs');

module.exports = {
  up (queryInterface, Sequelize) {
    let data = JSON.parse(fs.readFileSync('./data/products.json', 'utf-8'))
    data = data.map(el => {
      el.createdAt = el.updatedAt = new Date()
      return el
    })
    return queryInterface.bulkInsert('Products', data)
  },

  down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Products', null)
  }
};
