var express = require('express');
var router = express.Router();
// var sql = require('./sql');
var maintainer = require('./seqModel').maintainer;

router.get('/',function(req,res,next){

	//登录验证
	if(!req.session.username){
		res.render('fail', {title: "页面错误", message : ""});
		return;
	}

    sql.adminDatamanSelectAll(function(err, result){
		if(err){
			res.render('fail', {title: "获取数据失败", message : "数据库出现错误"});
			return;
		}

		res.render('index', {admins : result});
    });
});

/** 添加数据维护*/
router.post('/', function(req, res, next){
	//登录验证
	if(!req.session.username){
		res.render('fail', {title: "页面错误", message : ""});
		return;
	}
	
	var userInfo;
	userInfo["user"] = req.body.username;
	userInfo['passwd'] = req.body.password;
	userInfo["regionid"] = req.body.regionid;
	userInfo["typeid"] = 1;
	userInfo["lastlogintime"] = Date.parse(new Date()); 
	sql.connect();
	sql.adminDatamanInserOne(userInfo, function(err){
		if(err){
			res.render('fail', {title: "添加数据维护人员失败", message : "数据库出现错误"});
			return;
		}
		//跳转到主页面
		res.redirect("/admin_dataman/");
	});

});

/** 删除*/
router.get('/delete', function(req, res, next){
	//登录验证
	if(!req.session.username){
		res.render('fail', {title: "页面错误", message : ""});
		return;
	}

	var uid = req.query.id;
	sql.connect();
	sql.adminDatamanDeleteOne(uid, function(err){
		if(err){
			res.render('fail', {title: "删除数据维护人员失败", message : "数据库出现错误"});
			return;
		}
		//跳转到主页面
		res.redirect("/admin_dataman/");
	});
});


/** 搜索*/
router.get('/search', function(req, res, next){

	//登录验证
	if(!req.session.username){
		res.render('fail', {title: "页面错误", message : ""});
		return;
	}

	var key = req.query.key;
	sql.adminDatamanSearchKeyword(key, function(err, result){
		if(err){
			res.render('fail', {title: "搜索失败", message : "数据库出现错误"});
			return;
		}

		res.render('index', {admins : result});
	});

});



module.exports = router;