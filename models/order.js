"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.User);
      Order.belongsTo(models.Product);
    }
  }
  Order.init(
    {
      shippingAddress: {
        allowNull: false,
        type: DataTypes.TEXT,
        validate: {
          notNull: {
            msg: "Shipping address is required",
          },
          notEmpty: {
            msg: "Shipping address cannot be empty",
          },
        },
      },
      orderDate: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      orderNum: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      status: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      quantity: {
        allowNull: false,
        type: DataTypes.INTEGER,
        validate: {
          notNull: {
            msg: "Quantity is required",
          },
          notEmpty: {
            msg: "Quantity cannot be empty",
          },
        },
      },
      totalPrice: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      UserId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
      ProductId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "Products",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
