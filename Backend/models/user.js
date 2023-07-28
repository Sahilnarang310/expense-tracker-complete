const sequelize = require("../db/connect");
const { Sequelize, DataTypes } = require("sequelize");

const User = sequelize.define("users", {
// 	id: {
// 		autoIncrement: true,
// 		unique: true,
// 		allowNull: false,
// 		type: DataTypes.INTEGER,
// 		primaryKey: true,
// 	},
// 	name: {
// 		type: DataTypes.STRING,
// 	},
// 	email: {
// 		type: DataTypes.STRING,
// 		allowNull:false,
// 		unique:true,
// 	},
// 	password: {
// 		type: DataTypes.STRING,
// 	},
// 	ispremiumuser:DataTypes.BOOLEAN,
// 	total_cost:{
// 		type:DataTypes.INTEGER,
// 		defaultValue:1
// 	}
// });

// module.exports = User;


id: {
	type: Sequelize.INTEGER,
	autoIncrement: true,
	allowNull: false,
	primaryKey: true
},
name: Sequelize.STRING,
email: {
	type: Sequelize.STRING,
	unique: true,
},
password: {
	type: Sequelize.STRING,
},
ispremiumuser: Sequelize.BOOLEAN,
total_cost: {
	type: Sequelize.INTEGER,
	defaultValue: 0
  }

});  

module.exports = User;