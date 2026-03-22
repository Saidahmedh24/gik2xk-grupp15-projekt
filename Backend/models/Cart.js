const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const CartItem = sequelize.define("CartItem", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }
}, { timestamps: false }); // Often better to turn off for join tables

module.exports = CartItem;