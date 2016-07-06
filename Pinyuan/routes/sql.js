var mysql = require('mysql');
var nodejieba = require("nodejieba");

var HOST = '210.28.188.103';
var DATABASE = 'pinyuan';

var user = 'root';
var password = '123456';

var client;

var connect = function () {
	client = mysql.createConnection({
		host:HOST,
		user:user,
		password:password,
		database:DATABASE
	});
	client.connect();
}

//政策项目
var selectAsPagination = function(tag,callback) {
	var range = 4;
	var sql = "";
	if(tag == 0) {
		sql = "select id, title, image, uploadtime from policy, project where ismain = 1 order by uploadtime desc limit "+range;
	}
	if(tag == 1) {
		sql = "select id, title, image, uploadtime from policy where ismain = 1 order by uploadtime desc limit "+range;
	}
	if(tag == 2) {
		sql = "select id, title, image, uploadtime from Project where ismain = 1 order by uploadtime desc limit "+range;
	}
	client.query(sql,function(err,resluts){
		callback(err.resluts);
	});
}

var selectAsList = function(tag,lastupload,sinceupload,callback) {
	var range = 6;
	var sql = "";

	if(tag == 0){
		if(lastupload == 0 && sinceupload == 0) {
			sql = "select id, title, image, content, uploadtime from policy, project order by uploadtime desc limit "+range;
		}
		if(lastupload != 0 && sinceupload == 0) {
			sql = "select id, title, image, content, uploadtime from policy, project order by uploadtime desc "+
			" where uploadtime > "+lastupload+" limit "+range;
		}
		if(lastupload == 0 && sinceupload != 0) {
			sql = "select id, title, image, content, uploadtime from policy, project order by uploadtime desc "+
			" where uploadtime < "+sinceupload+" limit "+range;
		}
	}

	if(tag == 1){
		if(lastupload == 0 && sinceupload == 0) {
			sql = "select id, title, image, content, uploadtime from policy order by uploadtime desc limit "+range;
		}
		if(lastupload != 0 && sinceupload == 0) {
			sql = "select id, title, image, content, uploadtime from policy order by uploadtime desc "+
			" where uploadtime > "+lastupload+" limit "+range;
		}
		if(lastupload == 0 && sinceupload != 0) {
			sql = "select id, title, image, content, uploadtime from policy order by uploadtime desc "+
			" where uploadtime < "+sinceupload+" limit "+range;
		}
	}

	if(tag == 2){
		if(lastupload == 0 && sinceupload == 0) {
			sql = "select id, title, image, content, uploadtime from project order by uploadtime desc limit "+range;
		}
		if(lastupload != 0 && sinceupload == 0) {
			sql = "select id, title, image, content, uploadtime from project order by uploadtime desc "+
			" where uploadtime > "+lastupload+" limit "+range;
		}
		if(lastupload == 0 && sinceupload != 0) {
			sql = "select id, title, image, content, uploadtime from project order by uploadtime desc "+
			" where uploadtime < "+sinceupload+" limit "+range;
		}
	}

	client.query(sql,function(err,resluts){
		callback(err,resluts);
	});

}

var selectAsDetail = function(type,id,callback) {
	var sql = "";
	if (type == 1) {
		sql = "select title, content, image from policy where id = "+id;
	} else {
		sql = "select title, content, image from project where id = "+id;
	}
	client.query(sql,function(err,resluts){
		callback(err,resluts);
	});
}

//村务

var selectFromEventByType = function(tag,regionid, lastupload,sinceupload,callback) {
	var sql = "";
	var range = 6;
	if(lastupload == 0 && sinceupload == 0) {
		sql = "select id, title, image, content, uploadtime from event "+
			  " order by uploadtime desc "+
			  " where categoryid = "+tag+
			  " and regionid = "+regionid+
			  " limit "+range;
	}
	if(lastupload != 0 && sinceupload == 0) {
		sql = "select id, title, image, content, uploadtime from event "+
			  " order by uploadtime desc "+
			  " where categoryid = "+tag+
			  " and regionid = "+regionid+
			  " uploadtime > "+lastupload+
			  " limit "+range;
	}
	if(lastupload == 0 && sinceupload == 0) {
		sql = "select id, title, image, content, uploadtime from event "+
			  " order by uploadtime desc "+
			  " where categoryid = "+tag+
			  " and regionid = "+regionid+
			  " uploadtime < "+sinceupload+
			  " limit "+range;
	}
	client.query(sql,function(err,resluts){
		callback(err,resluts);
	});
}

var selectAsDetailFromEvent = function(id,callback) {
	var sql = "select * from event where id = "+id;
	client.query(sql,function(err,resluts){
		callback(err,resluts);
	});

}



//全局搜索

var globalSearch = function(tag,key,callback) {
	var sql = "";
	var conditon = "";
	var colomn = "";
	var words = nodejieba.cut(key);
	
	if (tag == 0) {
		colomn = "title";
	} else {
		colomn = "content";
	}
	for (var i = words.length - 1; i >= 0; i--) {
		if(conditon == "") {
			conditon = colomn + " like %"+words[i]+"% ";
		} 
		conditon = conditon + " or " + colomn + " like %"+words[i]+"% ";
	}
	sql = "select * from policy, project, event where "+conditon;

}

/** admin */

//用户名密码验证 
var adminLoginUPValidate = function(username, password, callback){

	var sql = "SELECT * FROM maintainer WHERE name='" + username + "' and passwd='" + password + "';";
	
	client.query(sql, function(err, resluts){
		callback(err, resluts);
	});
}

//获取所有管理员
var adminDatamanSelectAll = function(callback){
	var sql = "select * from maintainer order where typeid=1 by id desc;"
	client.query(sql, function(err, resluts){
		callback(err, resluts);
	});
}

//注册
var adminDatamanInserOne = function(userInfo ,callback){
	var sql = "insert into manitainer (name, passwd, regionid, typeid, lastlogintime) values('"+userInfo['name']+"', '"+userInfo['passwd']+"', '"+userInfo["regionid"]+"', "+userInfo["typeid"]+", '"+userInfo["lastlogintime"]+"');";
	client.query(sql, function(err){
		callback(err);
	});
}

//删除
var adminDatamanDeleteOne = function(uid, callback){
	var sql = "delete from manitainer where id=" + uid + ";";
	client.query(sql, function(err){
		callback(err);
	});
}

//搜索
var adminDatamanSearchKeyword = function(key, callback){
	var sql = "select * from manitainer where user like " + key + ";";
	client.query(sql, function(err, resluts){
		callback(err, resluts);
	});
}


/** admin */


exports.connect = connect;

exports.selectAsPagination = selectAsPagination;
exports.selectAsList = selectAsList;
exports.selectAsDetail = selectAsDetail;

exports.selectFromEventByType = selectFromEventByType;
exports.selectAsDetailFromEvent = selectAsDetailFromEvent;
exports.adminLoginUPValidate = adminLoginUPValidate;
exports.adminDatamanSelectAll = adminDatamanSelectAll;
exports.adminDatamanInserOne = adminDatamanInserOne;
exports.adminDatamanDeleteOne = adminDatamanDeleteOne;
exports.adminDatamanSearchKeyword = adminDatamanSearchKeyword;
