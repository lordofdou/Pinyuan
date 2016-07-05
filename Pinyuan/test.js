// s = 'ssss';
// r = s.substring(0,2);
// console.log(s);
// console.log(r);
// var nodejieba = require("nodejieba");
// var result = nodejieba.cut("八百标兵奔北坡");
// console.log(result);
var Sequelize = require('sequelize');
var sequelize = new Sequelize('mysql://root:123456@127.0.0.1:3306/pinyuan');
sequelize
.authenticate()
.then(function(err) {
console.log('Connection has been established successfully.');
})
.catch(function (err) {
console.log('Unable to connect to the database:', err);
});

var category = sequelize.define('category',
	{
		id:{
			type:Sequelize.BIGINT(11) 
		},
		type:{
			type:Sequelize.
		}
	},
	
	{
		freezeTableName:true
	}
);