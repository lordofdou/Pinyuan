var express = require('express');
var router = express.Router();
var sql = require('./sql');
var PER_PAGE = 10;

/** 所有政策列表*/
router.get('/',function(req,res,next){
	//登录验证
	if(!req.session.username){
		res.render('fail', {title: "页面错误", message : ""});
		return;
	}

	//数据维护人员验证
    if(req.session.typeid != 0){
    	res.render('fail', {title: "权限错误", message : "数据维护人员暂时没有权限"});
		return;
    }

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

/** 获取文章详细信息*/
router.get('/modify',function(req,res,next){

	//登录验证
	if(!req.session.username){
		res.render('fail', {title: "页面错误", message : ""});
		return;
	}

	//数据维护人员验证
    if(req.session.typeid != 0){
    	res.render('fail', {title: "权限错误", message : "数据维护人员暂时没有权限"});
		return;
    }

	var policyID = req.query.id;
	sql.connect();
	sql.adminPolicySelectOne(policyID, function(err, result){
		
		if(err){
			res.render('fail', {title: "获取数据失败", message : "数据库出现错误"});
			return;
		}

		sql.adminRegionSelectRegionIDandUserName(function(err, regions){
			if(err){
				res.render('fail', {title: "获取数据失败", message : "数据库出现错误"});
				return;
			}
			res.render('editarticle', {article : result, hide:req.query.hide, regions: regions});
		});
		
	});

});

/** 修改文章*/
router.post('/modify',function(req,res,next){
	//登录验证
	if(!req.session.username){
		res.render('fail', {title: "页面错误", message : ""});
		return;
	}

	//数据维护人员验证
    if(req.session.typeid != 0){
    	res.render('fail', {title: "权限错误", message : "数据维护人员暂时没有权限"});
		return;
    }

    var article = [];
    article['id'] = req.body.id;
    article['title'] = req.body.title;
    article['content'] = req.body.content;
    article['uploadtime'] = Date.parse(new Date());

    sql.adminPolicyModifyOne(article, function(err, result){
    	if(err){
    		res.render('fail', {title: "修改失败", message : "数据库出现错误"});
			return;
    	}

		var page = req.body.page;
		res.redirect("/admin_policy/?page="+page);

    });

});

/** 新增文章*/
router.post('/add',function(req,res,next){
	//登录验证
	if(!req.session.username){
		res.render('fail', {title: "页面错误", message : ""});
		return;
	}

	//数据维护人员验证
    if(req.session.typeid != 0){
    	res.render('fail', {title: "权限错误", message : "数据维护人员暂时没有权限"});
		return;
    }

    
});

module.exports = router;