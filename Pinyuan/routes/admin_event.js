var express = require('express');
var router = express.Router();
var sql = require('./sql');

router.get('/',function(req,res,next){

	//登录验证
	if(!req.session.username){
		res.render('fail', {title: "页面错误", message : ""});
		return;
	}

	

});

module.exports = router;