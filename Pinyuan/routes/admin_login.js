var express = require('express');
var router = express.Router();
var sql = require('./sql');

//get:req.query.xxx
//post:req.body.xxx

//登录页面显示
router.get('/',function(req,res,next){

	if(req.session.username){
		if(req.session.typeid == 0){
			res.redirect('/admin_dataman/');
			return;
		}else{
			res.redirect('/admin_event/');
			return;
		}
		return;
	}

	res.render('admin_index', {status : "none"});
});

//登录
router.post('/login', function(req, res, next){

	if(req.session.username){
		res.redirect("/admin_event/");
		return;
	}

	var username = req.body.username;
	var password = req.body.password;

	// sql.connect();
	sql.adminLoginUPValidate(username, password, function(err, result){
		if(err){
			res.render('fail', {title: "登录失败", message : "数据库出现错误"});
			return;
		}

		if(result.length == 0){
			//登录失败
			res.render('admin_index', {status : "block"});
			return;
		}

		var user = result[0];
		//登陆成功
		//更新时间
		sql.adminLoginupdateLoginTime(user['id'], Date.parse(new Date()));

		//记录Session
		req.session.username = username;
		req.session.id = user['id'];
		req.session.typeid = user['typeid'];
		req.session.regionid = user['regionid'];

		//跳转到主页面
		res.redirect("/admin_login/main");
	});
});

/** 跳转到主页面*/	
router.get('/main', function(req, res, next){

	if(!req.session.username){
		res.render('fail', {title: "您的账号已过期", message : "请重新登录"});
		return;
	}

	if(req.session.typeid == 1){
		//跳转到数据维护页面
		res.redirect("/admin_event/");
	}else{
		//跳转到用户列表页面
		res.redirect("/admin_dataman/");
	}

	
});

/** 注销*/	
router.get('/logout', function(req, res, next){
	if(!req.session.username){
		res.render('fail', {title: "您的账号已过期", message : "请重新登录"});
		return;
	}

		//记录Session
	req.session.username = null;
	req.session.id = null;
	req.session.typeid = null;
	req.session.regionid = null;

	//跳转到主页面
	res.redirect('/admin_login');
});

module.exports = router;