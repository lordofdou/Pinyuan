var mysql = require('mysql');
var nodejieba = require("nodejieba");


var HOST = '127.0.0.1';

var HOST = 'localhost';

var DATABASE = 'pinyuan';

var user = 'root';
var password = '';

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
var end = function(){
	client.end();
}



//政策项目
var selectAsPagination = function(tag,callback) {
	var range = 4;
	var sql = "";
	if(tag == 0) {
		sql = "(select id, title, image, uploadtime from policy where ismain = 1 order by uploadtime desc limit "+range/2+  
			  ")  union all "+
			  "(select id, title, image, uploadtime from project where ismain = 1 order by uploadtime desc limit "+range/2+
			  ")";
	}
	if(tag == 1) {
		sql = "select id, title, image, uploadtime from policy where ismain = 1 order by uploadtime desc limit "+range;
	}
	if(tag == 2) {
		sql = "select id, title, image, uploadtime from Project where ismain = 1 order by uploadtime desc limit "+range;
	}
	// console.log("hh:"+sql)
	client.query(sql,function(err,resluts){
		callback(err,resluts);
	});
}

var selectAsList = function(tag,lastupload,sinceupload,callback) {
	var range = 6;
	var sql = "";

	if(tag == 0){
		if(lastupload == 0 && sinceupload == 0) {
			sql = " (select id, title, image, content, uploadtime from policy order by uploadtime desc limit "+range/2+
			      " ) union all "+
			      " (select id, title, image, content, uploadtime from project order by uploadtime desc limit "+range/2+
			      " )";
		}
		if(lastupload != 0 && sinceupload == 0) {
			sql = " (select id, title, image, content, uploadtime from policy order by uploadtime desc where uploadtime > "+lastupload+" limit "+range/2+
				  " ) union all "+
				  " (select id, title, image, content, uploadtime from project order by uploadtime desc where uploadtime > "+lastupload+" limit "+range/2+
				  " )";
		}
		if(lastupload == 0 && sinceupload != 0) {
			sql = " (select id, title, image, content, uploadtime from policy order by uploadtime desc where uploadtime < "+sinceupload+" limit "+range/2+
				  " ) union all "+
				  " (select id, title, image, content, uploadtime from project order by uploadtime desc where uploadtime < "+sinceupload+" limit "+range/2+
				  " )";
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
			conditon = colomn + " like '%"+words[i]+"%' ";
		} 
		conditon = conditon + " or " + colomn + " like '%"+words[i]+"%' ";
	}
	sql = " (select * from policy where "+conditon+" )"+
		  " union all "+
		  " (select * from project where "+conditon+" )"+
		  " union all "+
		  " (select * from project where "+conditon+" )";
	// console.log(sql);
	var History = "insert into history (content,uploadtime) values ('"+key+"',"+Date.parse(new Date())+")";
	console.log(History);
		client.query(History,function(error,results){
			if(error){
				console.log("history---"+error.message);
			}
			
	});
	
	client.query(sql,function(err,results){
		callback(err,results);
	});

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
	var sql = "select * from maintainer where typeid=1 order by id desc;"
	client.query(sql, function(err, resluts){
		callback(err, resluts);
	});
}

//注册
var adminDatamanInserOne = function(userInfo ,callback){
	var sql = "insert into maintainer (name, passwd, regionid, typeid, lastlogintime) values('"+userInfo['user']+"', '"+userInfo['passwd']+"', '"+userInfo["regionid"]+"', "+userInfo["typeid"]+", '"+userInfo["lastlogintime"]+"');";
	client.query(sql, function(err){
		callback(err);
	});
}

//删除
var adminDatamanDeleteOne = function(uid, callback){
	var sql = "delete from maintainer where id=" + uid + ";";
	console.log(sql);
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


//获取所有乡镇及村庄
var adminRegionSelectAllList = function(callback){
	var sql = "select * from region;";
	client.query(sql, function(err, resluts){
		callback(err, resluts);
	});
}

//添加乡镇
var adminRegionAddBig = function(name, callback){
	var sql = "insert into region (name, super) values('"+name+"', 0);";
	client.query(sql, function(err){
		callback(err);
	});
}

//添加村庄
var adminRegionAddSmall = function(name, superID, callback){
	var sql = "insert into region (name, super) values('"+name+"', "+superID+")";
	client.query(sql, function(err){
		callback(err);
	});
}



//分页条惠农政策
var adminPolicySelectNumber = function(count, callback){
	var start = count.start ? count.start : 0;
	var num = count.num ? count.num : 0;
	var sql = "select * from policy ORDER BY uploadtime desc limit "+start+","+num+";";
    
    client.query(sql, function(err, resluts){
		callback(err, resluts);
    });
}
/*----------*/
//惠农政策数量
var adminPolicyCount = function(callback){
	var sql = "select count(*) from policy;"
	client.query(sql, function(err, results){
		if(!results || results.length == 0){
			callback(0);
			return;
		}
		callback(results[0]["count(*)"]);
	})
}

//分页条项目政策
var adminProjectSelectNumber = function(count, callback){
	var start = count.start ? count.start : 0;
	var num = count.num ? count.num : 0;
	var sql = "select * from project ORDER BY uploadtime desc limit "+start+","+num+";";
    
    client.query(sql, function(err, resluts){
		callback(err, resluts);
    });
}

//项目数量
var adminProjectCount = function(callback){
	var sql = "select count(*) from project;"
	client.query(sql, function(err, results){
		if(results.length == 0){
			callback(0);
			return;
		}
		callback(results[0]["count(*)"]);
	})
}

//乡镇&&用户
var adminRegionSelectRegionIDandUserName = function(callback){
	var sql = 'select id, name from region where super = 0;';
	client.query(sql, function(err, resluts){
		callback(err, resluts);
	});
}

//获取惠农政策详情
var adminPolicySelectOne = function(id, callback){
	var sql = "select * from policy where id =" + id;
	client.query(sql, function(err, resluts){
		callback(err, resluts);
	});
}

//删除项目
var adminPolicyDeleteOne = function(id, callback){
	var sql = "delete from policy where id =" + id;
	client.query(sql, function(err, resluts){
		callback(err);
	});	
}

//删除项目
var adminProjectDeleteOne = function(id, callback){
	var sql = "delete from project where id =" + id;
	client.query(sql, function(err, resluts){
		callback(err);
	});	
}

//获取惠农项目详情
var adminProjectSelectOne = function(id, callback){
	var sql = "select * from project where id =" + id;
	client.query(sql, function(err, resluts){
		callback(err, resluts);
	});
}

//登录时间更新
var adminLoginupdateLoginTime = function(id, time){
	var sql = "update maintainer set lastlogintime = '"+time+"' where id = "+ id;
	client.query(sql, function(err, resluts){
		
	});
}

//修改一篇惠农政策
var adminPolicyModifyOne = function(info, callback){
	var sql = "update policy set title='"+info["title"]+"',content='"+info["content"]+"',uploadtime='"+info['uploadtime']+"',image='"+info["image"]+"' where id="+info['id']+";";
	client.query(sql, function(err, resluts){
		callback(err, resluts);
	});
}

//修改一篇惠农项目
var adminProjectModifyOne = function(info, callback){
	var sql = "update project set title='"+info["title"]+"',content='"+info["content"]+"',uploadtime='"+info['uploadtime']+"',image='"+info["image"]+"' where id="+info['id']+";";
	client.query(sql, function(err, resluts){
		callback(err, resluts);
	});
}


//写一篇惠农政策
var adminPolicyInsertOne = function(info , callback){
	var sql = "insert into policy (title, content, image, ismain, uploadtime) values('"+info["title"]+"', '"+info["content"]+"', '"+info["image"]+"', 1, '"+info["uploadtime"]+"');";
	client.query(sql, function(err, resluts){
		callback(err, resluts);
	});
}

//写一篇惠农项目
var adminProjectInsertOne = function(info , callback){
	var sql = "insert into project (title, content, ismain, uploadtime) values('"+info["title"]+"', '"+info["content"]+"', 1, '"+info["uploadtime"]+"');";
	client.query(sql, function(err, resluts){
		callback(err, resluts);
	});
}

//政策搜索
var adminPolicySearch = function(key, type, callback){
	var sql;
	var conditon = "";
	var colomn = (type == 1) ? "content" : "title";
	var words = nodejieba.cut(key);
	
	for (var i = words.length - 1; i >= 0; i--) {
		if(conditon == "") {
			conditon = colomn + " like '%"+words[i]+"%' ";
		} 
		conditon = conditon + " or " + colomn + " like '%"+words[i]+"%' ";
	}
	sql = "select * from policy where "+conditon;
	console.log(sql);

    client.query(sql, function(err, resluts){
		callback(err, resluts);
    });
}

//项目搜索
var adminProjectSearch = function(key, type, callback){
	var sql;
	var conditon = "";
	var colomn = (type == 1) ? "content" : "title";
	var words = nodejieba.cut(key);
	
	for (var i = words.length - 1; i >= 0; i--) {
		if(conditon == "") {
			conditon = colomn + " like '%"+words[i]+"%' ";
		} 
		conditon = conditon + " or " + colomn + " like '%"+words[i]+"%' ";
	}
	sql = "select * from project where "+conditon;

    client.query(sql, function(err, resluts){
		callback(err, resluts);
    });
}

//删除一个村庄/乡镇
var adminRegionDeleteOne = function(id, callback){
	var firstSql = "delete from region where super ="+id;
    var sql = "delete from region where id = "+ id;
    client.query(firstSql, function(err, reslut){
		client.query(sql, function(err, results){
			callback(err, results);
		});
    });
}

//获取乡镇下所有村庄
var adminRegionSelectVillages = function(id, callback){
	var sql = "select * from region where super = "+id;
    client.query(sql, function(err, resluts){
		callback(err, resluts);
    });

}
//获取所有村庄
var adminRegionSelectAllVillages = function(callback){
	var sql = "select * from region where super <> 0";
    client.query(sql, function(err, resluts){
		callback(err, resluts);
    });	
}

//显示相应四大类村务
var adminEventSelectAll = function(id, callback){
	var sql = "select id, title, regionid, categoryid, uploadtime from event where regionid =" + id;
	client.query(sql, function(err, resluts){
		callback(err, resluts);
    });
}

//显示四大类
var adminEventCategorys = function(callback){
	var sql = "select * from category;";
	client.query(sql, function(err, resluts){
		callback(err, resluts);
	});
}

//删除村务公开
var adminEventDelete = function(id, callback){
	var sql = "delete from event where id =" + id;
	client.query(sql, function(err, resluts){
		callback(err);
	});
}

//获取一条村务公开
var adminEventSelectOne = function(id, callback){
	var sql = "select * from event where id ="+id;
	client.query(sql, function(err, resluts){
		callback(err, resluts);
	});
}

//上传一条村务公开
var adminEventModifyOne = function(article, callback){
	var sql = "update event set title='"+article["title"]+"',content='"+article["content"]+"',image='"+article["image"]+"',regionid='"+article["regionid"]+"',categoryid='"+article["categoryid"]+"',uploadtime='"+article["uploadtime"]+"' where id="+article['id'];
	console.log(sql);
	client.query(sql, function(err, resluts){
		callback(err, resluts);
	})
}

//写村务公开
var adminEventAddOne = function(article, callback){
	var sql = "insert into event (title, content, image, regionid, categoryid, uploadtime) values('"+article["title"]+"', '"+article["content"]+"', '"+article["image"]+"', '"+article["regionid"]+"', '"+article["categoryid"]+"', '"+article["uploadtime"]+"');";
	client.query(sql, function(err, resluts){
		callback(err);
	});
}

var adminRegionSelectAllListWithTypeid = function(typeid, vid, callback){
	var sql = "";
	if(typeid == 0){
		sql = "select * from region where super <> 0";
	}else{
		sql = "select * from region where super ="+vid;
	}
	client.query(sql, function(err, resluts){
		callback(err, resluts);
	})

}

/** admin */




/** web*/
var selectFromPolicyByIsmain = function(callback){
	var sql = "select id, title, image from policy order by uploadtime desc limit 6";
	client.query(sql,function(err,results){
		callback(err,resluts);
	});
}


var selectFromPolicyAsList = function(para,callback){
	var sql = "select * from policy order by uploadtime desc limit  6";
	client.query(sql,function(err,resluts){
		callback(err,resluts);
	});
};



var selectFromProjectAsList = function(para,callback){
	var sql = "select * from project order by uploadtime desc limit  6";
	client.query(sql,function(err,resluts){
		callback(err,resluts);
	});
};


var selectTownFromRegion = function(para,callback){
	var sql = "select * from region where super = 0";
	client.query(sql,function(err,resluts){
		callback(err,resluts);
	});
};

var selectVillageFromRegion = function(towns,callback){
	var sql = "select * from region where super <> 0";
	client.query(sql,function(err,results){
		callback(err,results);
	});
}



var selectFromEventBySuperid = function(para,superids,callback){
	var condition = "";
	for (var i = superids.length - 1; i >= 0; i--) {
		if(condition == ""){
			condition = " id = "+superids[i].id;
		}
		condition = condition + " or id = "+ superids[i].id;
		
	}
	var sql = "select * from event where "+condition;
	client.query(sql,function(err,resluts){
		callback(err,resluts);
	});
};

var selectAsDetailByUploadTime = function(uploadtime,callback){
	var sql = "select * from policy, project where uploadtime = "+uploadtime;
	client.query(sql,function(err,resluts){
		callback(err,resluts);
	});
}

var selectFromPolicyOrProjectByTime = function(tag,lasttime,callback){
	var table = "";
	if(tag == 0){
		table = " policy ";
	}else {
		table = " project ";
	}
	if(lasttime == 0){
		var sql = "select * from "+table+" order by uploadtime desc "+
			  " limit 6 ";
	}else{
		var sql = "select * from "+table+" order by uploadtime desc "+
			  " where uploadtime < "+lasttime+" limit 6 ";
	}
	// console.log("kkkk");
	// console.log(sql);

	client.query(sql,function(err,resluts){
		callback(err,resluts);
	});
}

var selectFromEventByRegeionid = function(id,callback){
	var sql = "select * from event where regionid = "+id;
	client.query(sql,function(err,resluts){
		callback(err,resluts);
	});
}

var selectFromEventByTime = function(id,tag,lasttime,callback){
	var sql = " select * from event order by uploadtime desc "+
			  " where categoryid = "+tag+ 
			  " and regionid = "+id+
			  " uploadtime < "+lasttime+
			  " limit 6 ";
	client.query(sql,function(err,resluts){
		callback(err,resluts);
	});
}
/* web end*/

var selectFromHistory = function(callback){
	var sql = "select content from history order by uploadtime desc limit 10";
	client.query(sql,function(err,results){
		callback(err,results);
	});
}

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
exports.adminRegionSelectAllList = adminRegionSelectAllList;
exports.adminRegionAddBig = adminRegionAddBig;
exports.adminRegionAddSmall = adminRegionAddSmall;
exports.adminPolicySelectNumber = adminPolicySelectNumber;
exports.adminRegionSelectRegionIDandUserName = adminRegionSelectRegionIDandUserName;
exports.adminPolicySelectOne = adminPolicySelectOne;
exports.adminLoginupdateLoginTime = adminLoginupdateLoginTime;
exports.adminPolicyModifyOne = adminPolicyModifyOne;
exports.adminPolicyInsertOne = adminPolicyInsertOne;
exports.adminPolicySearch = adminPolicySearch;

exports.adminProjectModifyOne = adminProjectModifyOne;
exports.adminProjectInsertOne = adminProjectInsertOne;
exports.adminProjectSearch = adminProjectSearch;
exports.adminProjectSelectOne = adminProjectSelectOne;
exports.adminProjectSelectNumber = adminProjectSelectNumber;

exports.adminRegionDeleteOne = adminRegionDeleteOne;
exports.adminEventSelectAll = adminEventSelectAll;
exports.adminEventCategorys = adminEventCategorys;
exports.adminEventDelete = adminEventDelete;
exports.adminPolicyCount = adminPolicyCount;
exports.adminProjectCount = adminProjectCount;
exports.adminEventAddOne = adminEventAddOne;
exports.adminRegionSelectVillages = adminRegionSelectVillages;
exports.adminRegionSelectAllVillages = adminRegionSelectAllVillages;
exports.adminRegionSelectAllListWithTypeid = adminRegionSelectAllListWithTypeid;
exports.adminProjectDeleteOne = adminProjectDeleteOne;
exports.adminPolicyDeleteOne = adminPolicyDeleteOne;

/**web*/
exports.selectFromPolicyAsList = selectFromPolicyAsList;
exports.selectFromProjectAsList = selectFromProjectAsList;
exports.selectTownFromRegion = selectTownFromRegion;
exports.selectFromEventBySuperid = selectFromEventBySuperid;
exports.selectAsDetailByUploadTime = selectAsDetailByUploadTime;
exports.selectFromPolicyOrProjectByTime = selectFromPolicyOrProjectByTime;
exports.selectFromEventByRegeionid = selectFromEventByRegeionid;
exports.selectFromEventByTime = selectFromEventByTime;
exports.adminEventSelectOne = adminEventSelectOne;
exports.adminEventModifyOne = adminEventModifyOne;

exports.selectVillageFromRegion = selectVillageFromRegion;
exports.globalSearch = globalSearch;

exports.selectFromHistory = selectFromHistory;

exports.end = end;