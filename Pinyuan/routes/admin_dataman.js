var express = require('express');
var router = express.Router();
var sql = require('./sql');
var maintainer = require('./seqModel').maintainer;

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

	sql.connect();
    sql.adminDatamanSelectAll(function(err, result){

		if(err){
			res.render('fail', {title: "获取数据失败", message : "数据库出现错误"});
			return;
		}
		sql.connect();
		sql.adminRegionSelectRegionIDandUserName(function(err, regions){

			if(err){
				res.render('fail', {title: "获取数据失败", message : "数据库出现错误"});
				return;
			}

			for (var i = 0; i < result.length; i++) {
	        	var regionID = result[i]['regionid'];

	        	for(var reg in regions){
	        		if(regions[reg]['id'] == regionID){
	        			result[i]['regionName'] = regions[reg]['name'];
	        			break;
	        		}
	        	}
	        };

	        console.log(result);

			res.render('index', {admins : result, regions: regions});

		});

    });
});

/** 添加数据维护*/
router.post('/', function(req, res, next){
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
	//数据维护人员验证
    if(req.session.typeid != 0){
    	res.render('fail', {title: "权限错误", message : "数据维护人员暂时没有权限"});
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
	//数据维护人员验证
    if(req.session.typeid != 0){
    	res.render('fail', {title: "权限错误", message : "数据维护人员暂时没有权限"});
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