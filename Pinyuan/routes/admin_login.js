var express = require('express');
var router = express.Router();
var sql = require('./sql');

//get:req.query.xxx
//post:req.body.xxx

//登录页面显示
router.get('/',function(req,res,next){
console.log("H");
	res.render('admin_index');

});

//登录
router.post('/login', function(req, res, next){

	var username = req.query.username;
	var password = req.query.password;
	console.log(username + " --- " + password);

	// var satus = "none" || "block";

});

module.exports = router;