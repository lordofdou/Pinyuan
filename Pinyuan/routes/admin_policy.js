var express = require('express');
var router = express.Router();
var sql = require('./sql');
var PER_PAGE = 10;

/** 所有政策列表*/
router.get('/',function(req,res,next){
	//登录验证
	// if(!req.session.username){
	// 	res.render('fail', {title: "页面错误", message : ""});
	// 	return;
	// }

	/**** 分页 *****/
	var currentPage = 1;
	if(req.query.page){
		currentPage = (req.query.page >= 1) ? req.query.page : 1;
	}

	//创建count
	var count = new Array();
	count.start = (currentPage - 1) * PER_PAGE;
	count.num = PER_PAGE;
	/**** 分页 *****/

	sql.connect();
	sql.adminPolicySelectNumber(count, function(err, numbers){

		if(err){
			res.render('fail', {title: "获取乡镇数据失败", message : "数据库出现错误"});
			return;
		}

		/**** 分页 *****/
		var recordCount = numbers.length;
		
		var pagesNum = parseInt(parseInt(recordCount) / PER_PAGE);
		if(recordCount != 0){
			if(recordCount%PER_PAGE){
				pagesNum = pagesNum + 1;
			}
			if(currentPage > pagesNum){
				count.start = (pagesNum - 1) * PER_PAGE;
				currentPage = pagesNum;
			}
		}
		/**** 分页 *****/
		res.render('policy', {policies: numbers, pagesNum: pagesNum, currentPage: currentPage});

	});


});

module.exports = router;