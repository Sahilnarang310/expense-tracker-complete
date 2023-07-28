const sequelize = require("../db/connect")
const { Sequelize,DataTypes } = require("sequelize");
const expenseUser = sequelize.define('expenses', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	  },
	//   expense: Sequelize.STRING,
	  amount: {
		type: Sequelize.INTEGER,
		allowNull: false
	  },
	  description: {
		type: Sequelize.STRING,
		allowNull: false
	  },
	  category: {
		type: Sequelize.STRING,
		allowNull: false
	  }
	});
module.exports = { expenseUser };