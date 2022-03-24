"use strict";
const { Model } = require("sequelize");
const { user } = require("../controllers");
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

    formatDate(val) {
      let yyyy = val.getFullYear()
      let mm = val.getMonth() + 1
      let dd = val.getDate()
    
      if (dd < 10) dd = '0' + dd
      if (mm < 10) mm = '0' + mm
    
      return `${yyyy}-${mm}-${dd}`
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
        type: DataTypes.DATE,
      },
      orderNum: {
        type: DataTypes.STRING,
      },
      status: {
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
      hooks: {
        beforeCreate: order => {
          order.orderDate = order.formatDate(new Date())
          order.status = 'pending'
          order.orderNum = 'example'
        },
      },
    }
  );
  return Order;
};
