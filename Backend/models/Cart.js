const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Cart = sequelize.define("Cart", {});

module.exports = Cart;