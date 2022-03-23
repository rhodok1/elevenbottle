'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Category.hasMany(models.Product)
    }
  }
  Category.init({
    allowNull: false,
    name: DataTypes.STRING,
    validate: {
      notNull: {
        msg: 'Category is required'
      },
      notEmpty: {
        msg: 'Category cannot be empty'
      }
    }
  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};