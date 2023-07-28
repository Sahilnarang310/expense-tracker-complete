const sequelize = require("../db/connect");
const { Sequelize, DataTypes } = require("sequelize");

const fileurl = sequelize.define(`fileurl`, {
	id: {
		unique: true,
		primaryKey: true,
		autoIncrement: true,
		type: Sequelize.INTEGER,
	},
	fileURL: {
		type: Sequelize.STRING,
	},
});

module.exports = fileurl;
