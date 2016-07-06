var mysql = require('mysql');
var DATABASE_NAME = "pinyuan"
var client;
var user;
var password;

// user = process.argv[2];
// password = process.argv[3];
user = 'root';
password = '123456';


client = mysql.createConnection({
	user:user,
	password:password
});

client.connect();
//创建数据库
client.query('create database if not exists '+DATABASE_NAME+' character set UTF8');
//调用数据库
client.query('use pinyuan');

//创建数据表
//维护人员表 maintainer

createtable = ' create table if not exists maintainer ('+
			  ' id int(11) not null auto_increment, ' +
			  ' name varchar(50), '+
			  ' passwd varchar(50), '+
			  ' regionid int(11), '+
			  ' typeid int(11), '+
			  ' lastlogintime varchar(50), '+
			  '	primary key (id) '+
			  ' ) ENGINE=InnoDB DEFAULT CHARSET=utf8 ';
client.query(createtable);	

//维护人员类型表 type
createtable = ' create table if not exists type ('+
			  ' id int(11) not null auto_increment, ' +
			  ' typename varchar(20), '+
			  '	primary key (id) '+
			  ' ) ENGINE=InnoDB DEFAULT CHARSET=utf8 ';
client.query(createtable);
client.query('insert into type (typename) values ("超级管理员")');
client.query('insert into type (typename) values ("数据管理员")');

//乡镇街道表 region
createtable = ' create table if not exists region ('+
			  ' id int(11) not null auto_increment, ' +
			  ' name varchar(50), '+
			  ' super int(11), '+
			  '	primary key (id) '+
			  ' ) ENGINE=InnoDB DEFAULT CHARSET=utf8 ';
client.query(createtable);

//惠农政策表 policy
createtable = ' create table if not exists policy ('+
			  ' id int(11) not null auto_increment, ' +
			  ' title varchar(50), '+
			  ' content longtext, '+
			  ' image varchar(100), '+
			  ' ismain int(11) default 0, '+
			  ' uploadtime varchar(50), '+
			  '	primary key (id) '+
			  ' ) ENGINE=InnoDB DEFAULT CHARSET=utf8 ';
client.query(createtable);

//惠农项目表 project
createtable = ' create table if not exists project ('+
			  ' id int(11) not null auto_increment, ' +
			  ' title varchar(50), '+
			  ' content longtext, '+
			  ' image varchar(100), '+
			  ' ismain int(11) default 0, '+
			  ' uploadtime varchar(50), '+
			  '	primary key (id) '+
			  ' ) ENGINE=InnoDB DEFAULT CHARSET=utf8 ';
client.query(createtable);

//村务内容表 event
createtable = ' create table if not exists event ('+
			  ' id int(11) not null auto_increment, ' +
			  ' title varchar(50), '+
			  ' content longtext, '+
			  ' image varchar(100), '+
			  ' regionid int(11), '+
			  ' categoryid int(11), '+
			  ' uploadtime varchar(50), '+
			  '	primary key (id) '+
			  ' ) ENGINE=InnoDB DEFAULT CHARSET=utf8 ';
client.query(createtable);

//村务类型表 category
createtable = ' create table if not exists category ('+
			  ' id int(11) not null auto_increment, ' +
			  ' type varchar(50), '+
			  '	primary key (id) '+
			  ' ) ENGINE=InnoDB DEFAULT CHARSET=utf8 ';
client.query(createtable);
client.query('insert into category (type) values ("党务公开")');
client.query('insert into category (type) values ("村务公开")');
client.query('insert into category (type) values ("财务公开")');
client.query('insert into category (type) values ("惠农资金")');


console.log("create databse successfully,Ctrl + C to quit");

