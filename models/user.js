"use strict";
const { Model } = require("sequelize");

const bcrypt = require("bcryptjs");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Order);
    }
  }
  User.init(
    {
      email: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING,
        validate: {
          notNull: {
            msg: `Email is required`,
          },
          notEmpty: {
            msg: "Email cannot be empty",
          },
          isEmail: {
            msg: "Invalid email format",
          },
        },
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          notNull: {
            msg: "Password is required",
          },
          notEmpty: {
            msg: "Password cannot be empty",
          },
          passwordLength(val) {
            if (val.length < 8 && val.length !== 0) {
              throw new Error(
                "Password has not reached minimum characters of 8"
              );
            }
          },
        },
      },
      role: {
        allowNull: false,
        type: DataTypes.STRING,
        validation: {
          notNull: {
            msg: "Please choose a role",
          },
        },
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
      hooks: {
        beforeCreate(user, options) {
          const salt = bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync(user.password, salt);
          user.password = hash;
          user.createdAt = user.updatedAt = new Date();
        },
      },
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
