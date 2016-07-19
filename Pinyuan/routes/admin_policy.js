var express = require('express');
var router = express.Router();
var sql = require('./sql');
var PER_PAGE = 10;
var formidable = require('formidable');
var fs = require('fs');
var AVATAR_UPLOAD_FOLDER = '/policyUpload/';
var path=require('path');
var	StringDecoder = require('string_decoder').StringDecoder;
var	EventEmitter = require('events').EventEmitter;
var	util=require('util');

/** 所有政策列表*/
router.get('/',function(req,res,next){
	//登录验证
	if(!req.session.username){
		res.render('fail', {title: "您的账号已过期", message : "请重新登录"});
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

	// sql.connect();
	sql.adminPolicyCount(function(numbers){
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
				res.render('fail', {title: "获取乡镇数据失败", message : "数据库出现错误"});
				return;
			}
			res.render('policy', {policies: results, pagesNum: pagesNum, currentPage: currentPage, isSuperAdmin: !req.session.typeid, username: req.session.username});
			// sql.end();
		});

	});

});

/** 获取文章详细信息*/
router.get('/modify',function(req,res,next){

	//登录验证
	if(!req.session.username){
		res.render('fail', {title: "您的账号已过期", message : "请重新登录"});
		return;
	}

	//数据维护人员验证
    if(req.session.typeid != 0){
    	res.render('fail', {title: "权限错误", message : "数据维护人员暂时没有权限"});
		return;
    }

	var policyID = req.query.id;
	// sql.connect();
	sql.adminPolicySelectOne(policyID, function(err, result){
		result = result[0];
		if(err){
			res.render('fail', {title: "获取数据失败", message : "数据库出现错误"});
			return;
		}

		result['page'] = req.query.page;
		res.render('editarticle', {go : "/admin_policy/modify", article : result, hide:1, isSuperAdmin: !req.session.typeid, username: req.session.username});
		// sql.end();
	});

});

/** 修改文章*/
router.post('/modify',function(req,res,next){
	//登录验证
	if(!req.session.username){
		res.render('fail', {title: "您的账号已过期", message : "请重新登录"});
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
    form.parse(req,function(error,field,files){
    	if (error) {
	      res.render('fail', {title : "配图上传失败", message: err});
	      return;		
	    } 

        var article = [];
        article['id'] = field.articleid;
	    article['title'] = field.title;
	    article['content'] = field.content;
	    article['uploadtime'] = Date.parse(new Date());

		//图片存储与地址存储
		var extName = 'png';  //后缀名
	    var avatarName;		  //随机数文件名
	    var newPath;		  //文件存储路径
	    var file = files[0];
	    // console.log("files======"+files[0]);
	    // console.log("files======"+files[1]);
	    // console.log("files======"+files.length);
	    // if(files[0] == undefined){
	    // 	console.log("uuuu")
	    // }else{

	    // }
	    // console.log("path====="+files["image1"]);
	    // for (var obj in files["image1"]){
	    // 	console.log(obj + "---" + files["image1"][obj]);
	    // 	// console.log()

	    // }
	    // console.log("---" + files["image1"]['size']);

	    if(files["image1"]['size']!=0){
	    	avatarName = Math.random() + '.' + extName;
		    newPath= form.path + avatarName;
		    //重命名图片并同步到磁盘上
	    	fs.renameSync(files["image1"]["path"], newPath);
	    	//访问路径
	    	newPath = AVATAR_UPLOAD_FOLDER + avatarName;

			article["image"] = newPath;
	    }else{
	    	article["image"] = "";
	    }
	    


		// sql.connect();
	    sql.adminPolicyModifyOne(article, function(err, result){
	    	
	    	if(err){
	    		res.render('fail', {title: "修改失败", message : "数据库出现错误"});
				return;
	    	}

			var page = field.page;
			res.redirect("/admin_policy/?page="+page);
			// sql.end();
	    });
		
    });

});


/** 搜索政策*/
router.get('/search', function(req, res, next){
	//登录验证
	if(!req.session.username){
		res.render('fail', {title: "您的账号已过期", message : "请重新登录"});
		return;
	}

	//数据维护人员验证
    if(req.session.typeid != 0){
    	res.render('fail', {title: "权限错误", message : "数据维护人员暂时没有权限"});
		return;
    }

    var key = req.query.key;
    if(!key || key.length == 0){
    	res.redirect("/admin_policy/");
    	return;
    }

    // sql.connect();
   //  sql.adminPolicySearch(key, 1, function(err, result1){
   //  	if(err){
   //  		res.render('fail', {title: "搜索失败", message : err.message});
			// return;
   //  	}
    	sql.adminPolicySearch(key,function(err, result){
    		if(err){
	    		res.render('fail', {title: "搜索失败", message : err.message});
				return;
	    	}

			// var result = result1.concat(result2);
			result['key'] = key;
			res.render('policy', {policies: result, isSuperAdmin: !req.session.typeid, username: req.session.username,pagesNum:1,currentPage:1});
			// sql.end();
    
    	});
	// });
});


/** 新增文章界面*/
router.get('/add',function(req,res,next){

	//登录验证
	if(!req.session.username){
		res.render('fail', {title: "您的账号已过期", message : "请重新登录"});
		return;
	}

	//数据维护人员验证
    if(req.session.typeid != 0){
    	res.render('fail', {title: "权限错误", message : "数据维护人员暂时没有权限"});
		return;
    }

	res.render('editarticle', { article: [], go : "/admin_policy/add", hide:1, isSuperAdmin: !req.session.typeid, username: req.session.username});
			
});

/** 新增文章*/
router.post('/add',function(req,res,next){
	//登录验证
	if(!req.session.username){
		res.render('fail', {title: "您的账号已过期", message : "请重新登录"});
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
	    article['title'] = fields.title;
	    article['content'] = fields.content;
	    article['uploadtime'] = Date.parse(new Date());
	    if(article['title'] == "" || article['content'] == ""){
	    	res.send("<script> alert('标题和内容不能为空'); window.location.href='/admin_policy' </script>")
	    	return;
	    }

		//图片存储与地址存储
		var extName = 'png';  //后缀名
	    var avatarName;		  //随机数文件名
	    var newPath;		  //文件存储路径
	    var file = files[0];

	    if(files["image1"]['size']!=0){
	    	avatarName = Math.random() + '.' + extName;
		    newPath= form.path + avatarName;
		    //重命名图片并同步到磁盘上
	    	fs.renameSync(files["image1"]["path"], newPath);
	    	//访问路径
	    	newPath = AVATAR_UPLOAD_FOLDER + avatarName;

			article["image"] = newPath;
	    }else{
	    	article["image"] = "";
	    }	
	    

		// sql.connect();
	    sql.adminPolicyInsertOne(article, function(err, result){

	    	if(err){
	    		res.render('fail', {title: "添加惠农政策失败", message : "数据库出现错误" + err});
				return;
	    	}

			res.redirect("/admin_policy/");
			// sql.end();
	    });
		
    });
});


/** 删除*/
router.get('/delete',function(req,res,next){
		//登录验证
	if(!req.session.username){
		res.render('fail', {title: "您的账号已过期", message : "请重新登录"});
		return;
	}

    var id = req.query.deleteid;
	var page = req.query.page;

    // sql.connect();
    sql.adminPolicyDeleteOne(id, function(err, results){
    	if(err){
    		res.render('fail', {title: "删除失败", message : "数据库出现错误"});
			return;
    	}

    	//跳转到主页面
		res.redirect("/admin_policy?page="+page);
		// sql.end();
    });
});

module.exports = router;