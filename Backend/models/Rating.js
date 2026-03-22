const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Rating = sequelize.define("Rating", {
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = Rating;