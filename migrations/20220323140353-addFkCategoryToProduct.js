'use strict';

module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.addColumn("Products", "CategoryId", {
      type: Sequelize.INTEGER,
      references: {
        model: "Categories",
        key: "id",
      },
      onUpdate: "cascade",
      onDelete: "cascade",
    });
  },

  down (queryInterface, Sequelize) {
    return queryInterface.removeColumn("Products", "CategoryId");
  }
};
