var express = require('express');
var router = express.Router();
var sql = require('./sql');

//get:req.query.xxx
//post:req.body.xxx

//登录页面显示
router.get('/',function(req,res,next){

	if(req.session.username){
		return;
	}

	res.render('admin_index', {status : "none"});
});

//登录
router.post('/login', function(req, res, next){

	if(req.session.username){
		return;
	}

	var username = req.body.username;
	var password = req.body.password;

	sql.connect();
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

		//登陆成功
		//记录Session
		req.session.username = username;
		req.session.id = result['id'];
		req.typeid = result['typeid'];

		//跳转到主页面
		res.redirect("/admin_login/main");
	});
});

/** 跳转到主页面*/	
router.get('/main', function(req, res, next){

	if(!req.session.username){
		res.render('fail', {title: "页面错误", message : ""});
		return;
	}

	//跳转到用户列表页面
	res.redirect("/admin_dataman/");
});

module.exports = router;