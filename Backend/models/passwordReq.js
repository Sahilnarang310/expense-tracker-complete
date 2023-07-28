const sequelize = require("../db/connect");
const { Sequelize, DataTypes } = require("sequelize");

const forgotpassword = sequelize.define("forgotpassword", {
	id: {
		type: Sequelize.UUID,

		allowNull: false,
		primaryKey: true,
	},
    active:{
        type:Sequelize.BOOLEAN,
		expiresby: Sequelize.DATE
    }
   

});
module.exports = forgotpassword;
