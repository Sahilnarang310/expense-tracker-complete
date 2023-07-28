const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../db/connect");

const Order = sequelize.define("order", {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	paymentid: {
		type: Sequelize.STRING,
	},
	orderid: {
		type: Sequelize.STRING,
	},
	status: {
		type: Sequelize.STRING,
	},
});
module.exports = Order;
