var mysql = require('mysql');
var DATABASE_NAME = "pinyuan"
var client;


client = mysql.createConnection({
	user:'root',
	password:'123456'
});
client.connect();
client.query('create database if not exists '+DATABASE_NAME+' character set UTF8');


