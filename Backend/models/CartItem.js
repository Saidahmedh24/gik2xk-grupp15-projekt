const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const CartItem = sequelize.define("CartItem", {
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  }
});

module.exports = CartItem;