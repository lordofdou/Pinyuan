var mysql = require('mysql');
var DATABASE_NAME = "pinyuan"
var client;
var user;
var password;

console.log("input superadmin name:");
process.stdin.on('readable', () => {
  var chunk = process.stdin.read();
  if (chunk !== null) {
    process.stdout.write(`data: ${chunk}`);
  }
});

process.stdin.on('end', () => {
  process.stdout.write('end');
});
// user = process.stdin.read();
// console.log(user);
// console.log("input password:");

// client = mysql.createConnection({
// 	user:'root',
// 	password:'123456'
// });
// client.connect();
// client.query('create database if not exists '+DATABASE_NAME+' character set UTF8');


