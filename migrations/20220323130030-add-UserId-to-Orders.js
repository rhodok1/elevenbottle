"use strict";

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn("Orders", "UserId", {
      type: Sequelize.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
      onUpdate: "cascade",
      onDelete: "cascade",
    });
  },

  down(queryInterface, Sequelize) {
    return queryInterface.removeColumn("Orders", "UserId");
  },
};
