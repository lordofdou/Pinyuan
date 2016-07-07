var express = require('express');
var router = express.Router();
var sql = require('./sql');
var PER_PAGE = 10;
var formidable = require('formidable');
var fs = require('fs');
var AVATAR_UPLOAD_FOLDER = '/projectUpload/';
var path=require('path');
var	StringDecoder = require('string_decoder').StringDecoder;
var	EventEmitter = require('events').EventEmitter;
var	util=require('util');

/** 所有项目列表*/
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
	sql.adminProjectCount(function(numbers){

		/**** 分页 *****/
		var recordCount = numbers;
		
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

		sql.adminPolicySelectNumber(count, function(err, results){

			if(err){
				res.render('fail', {title: "获取惠农项目数据失败", message : "数据库出现错误"});
				return;
			}
			res.render('project', {projects: results, pagesNum: pagesNum, currentPage: currentPage, isSuperAdmin: !req.session.typeid, username: req.session.username});
		});

		
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

		// sql.adminRegionSelectRegionIDandUserName(function(err, regions){
		// 	if(err){
		// 		res.render('fail', {title: "获取数据失败", message : "数据库出现错误"});
		// 		return;
		// 	}
		// 	res.render('editarticle', {article : result, hide:req.query.hide, regions: regions});
		// });
		res.render('editarticle', {article : result, hide:req.query.hide, isSuperAdmin: !req.session.typeid, username: req.session.username});
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

	var form = new formidable.IncomingForm(); 
    form.path = __dirname + '/../public' + AVATAR_UPLOAD_FOLDER;
	
	// 上传配图
    form.parse(req,function(error,fields,files){
    	if (error) {
	      res.render('fail', {title : "配图上传失败", message: err});
	      return;		
	    } 

        var article = [];
        article['id'] = field.id;
	    article['title'] = field.title;
	    article['content'] = field.content;
	    article['uploadtime'] = Date.parse(new Date());

		//图片存储与地址存储
		var extName = 'png';  //后缀名
	    var avatarName;		  //随机数文件名
	    var newPath;		  //文件存储路径
	    var file = files[0];
	    avatarName = Math.random() + '.' + extName;
	    newPath= form.path + avatarName;
	    //重命名图片并同步到磁盘上
    	fs.renameSync(files[key]["path"], newPath);
    	//访问路径
    	newPath = AVATAR_UPLOAD_FOLDER + avatarName;

		article["image"] = newPath;


	    sql.adminProjectModifyOne(article, function(err, result){
	    	
	    	if(err){
	    		res.render('fail', {title: "修改失败", message : "数据库出现错误"});
				return;
	    	}

			var page = field.page;
			res.redirect("/admin_project/?page="+page);

	    });
		
    });

});

/** 搜索政策*/
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
    sql.connect();
    sql.adminProjectSearch(key, function(err, result){
    	if(err){
    		res.render('fail', {title: "搜索失败", message : "数据库出现错误"});
			return;
    	}

		res.render('project', {projects: result, isSuperAdmin: !req.session.typeid, username: req.session.username});


    });
});

/** 新增文章界面*/
router.get('/add',function(req,res,next){

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

    res.render('editarticle');

});



/** 新增文章界面*/
router.get('/add',function(req,res,next){

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

    res.render('editarticle');

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

	var form = new formidable.IncomingForm(); 
    form.path = __dirname + '/../public' + AVATAR_UPLOAD_FOLDER;
	
	// 上传配图
    form.parse(req,function(error,fields,files){
    	if (error) {
	      res.render('fail', {title : "配图上传失败", message: err});
	      return;		
	    } 

        var article = [];
	    article['title'] = field.title;
	    article['content'] = field.content;
	    article['uploadtime'] = Date.parse(new Date());

		//图片存储与地址存储
		var extName = 'png';  //后缀名
	    var avatarName;		  //随机数文件名
	    var newPath;		  //文件存储路径
	    var file = files[0];
	    avatarName = Math.random() + '.' + extName;
	    newPath= form.path + avatarName;
	    //重命名图片并同步到磁盘上
    	fs.renameSync(files[key]["path"], newPath);
    	//访问路径
    	newPath = AVATAR_UPLOAD_FOLDER + avatarName;

		article["image"] = newPath;


	    sql.adminProjectInsertOne(article, function(err, result){

	    	if(err){
	    		res.render('fail', {title: "添加惠农项目失败", message : "数据库出现错误"});
				return;
	    	}

			res.redirect("/admin_project/");

	    });
		
    });
});


module.exports = router;