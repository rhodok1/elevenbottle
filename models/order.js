'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.User)
      Order.belongsTo(models.Product)
    }
  }
  Order.init({
    shippingAddress: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    shippingAddress: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    orderDate: {
      allowNull: false,
      type: DataTypes.DATE
    },
    ordernum: {
      allowNull: false,
      type: DataTypes.STRING
    },
    status: {
      allowNull: false,
      type: DataTypes.BOOLEAN
    },
    quantity: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    totalPrice: {
      allowNull: false,
      type: DataTypes.FLOAT
    },
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};