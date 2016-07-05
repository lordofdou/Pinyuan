var mysql = require('mysql');
var nodejieba = require("nodejieba");

var HOST = 'localhost';
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


exports.connect = connect;

exports.selectAsPagination = selectAsPagination;
exports.selectAsList = selectAsList;
exports.selectAsDetail = selectAsDetail;

exports.selectFromEventByType = selectFromEventByType;
exports.selectAsDetailFromEvent = selectAsDetailFromEvent;

