var express = require('express');
var router = express.Router();
var sql = require('./sql');
var formidable = require('formidable');
var fs = require('fs');
var AVATAR_UPLOAD_FOLDER = '/eventUpload/';
var path=require('path');
var	StringDecoder = require('string_decoder').StringDecoder;
var	EventEmitter = require('events').EventEmitter;
var	util=require('util');

router.get('/',function(req,res,next){

	//登录验证
	if(!req.session.username){
		res.render('fail', {title: "页面错误", message : ""});
		return;
	}

	sql.connect();
	sql.adminRegionSelectAllList(function(err, results){
		if(err){
			res.render('fail', {title: "查询乡镇失败", message : "数据库出现错误"});
			return;
		}

		var bigs = [];

		for(var line in results){
			var obj = results[line];
			if(obj["super"] == 0){
				bigs.push(obj);
			}
		}

		for (var i = 0; i < bigs.length; i++) {
			bigs[i]["subs"] = [];
		};

		for(var line in results){
			var obj = results[line];
            if(obj["super"] != 0){
            	var superID = obj['super'];
            	for (var i = 0; i < bigs.length; i++) {
            		if(bigs[i]['id'] == superID){
            			bigs[i]['subs'].push(obj);
            			break;
            		}
            	};
            }
		}

		var regionID = req.session.regionid;
		var sendout = [];
		if(regionID){
			//数据维护人员
			for(var tmp in bigs){
				if(bigs[tmp]['id'] == regionID){
					sendout[0] = bigs[tmp];
					break;
				}
			}
		}else{
			sendout = bigs;
		}

		res.render('openaffairs', {countries: sendout, isSuperAdmin: !req.session.typeid, username: req.session.username});
	});

});

router.get('/details',function(req,res,next){
	//登录验证
	if(!req.session.username){
		res.render('fail', {title: "页面错误", message : ""});
		return;
	}

	//获取乡镇名称 和 村庄名称
	var title = req.query.ttitle;
	var smallID = req.query.id;

	//获取村庄 四大类
	sql.connect();
	sql.adminEventSelectAll(smallID, function(err, articles){

		if(err){
			res.render('fail', {title: "获取数据失败", message : "数据库出现错误"});
			return;
		}
		sql.adminEventCategorys(function(err, categorys){

			if(err){
				res.render('fail', {title: "获取乡镇数据失败", message : "数据库出现错误"});
				return;
			}

			var sendOut = [];
			for(var index in categorys){
				var obj = categorys[index];
				var cateID = obj['id'];

				var cateArts = [];
				for(var j in articles){
					var atr = articles[j];
					if(atr["categoryid"] == cateID){
						cateArts.push(atr);
					}
				}

				sendOut[obj['type']] = cateArts;
			}

			res.render('openaffairsdetail', {ttitle : title, details: sendOut, isSuperAdmin: !req.session.typeid, username: req.session.username});

		});
	});
});

/** 删除*/
router.get('/delete',function(req,res,next){
		//登录验证
	if(!req.session.username){
		res.render('fail', {title: "页面错误", message : ""});
		return;
	}

    var id = req.query.deleteid;
	var title = req.query.ttitle;
	var smallID = req.query.smallid;

    sql.connect();
    sql.adminEventDelete(id, function(err, results){
    	if(err){
    		res.render('fail', {title: "删除失败", message : "数据库出现错误"});
			return;
    	}

    	//跳转到主页面
		res.redirect("/admin_event/details?ttitle=" + title+"&id="+smallID);
    });
});

router.get('/modify', function(req, res, next){
	//登录验证
	if(!req.session.username){
		res.render('fail', {title: "页面错误", message : ""});
		return;
	}

	var artID = req.query.articleid;
	var title = req.query.ttitle;
	var smallID = req.query.smallID;

	sql.connect();
	sql.adminEventSelectOne(artID, function(err, result){
		
		if(err){
			res.render('fail', {title: "获取数据失败", message : "数据库出现错误"});
			return;
		}

		sql.adminRegionSelectAllList(function(err, lists){
			if(err){
				res.render('fail', {title: "获取数据失败", message : "数据库出现错误"});
				return;
			}

			sql.adminEventCategorys(function(err, cates){
				if(err){
					res.render('fail', {title: "获取数据失败", message : "数据库出现错误"});
					return;
				}

				var villages = [];
				var vID = req.session.regionid;
				for(var index in lists){
					if(lists[index]['id'] == vID){
						villages.push(lists[index]);
					}
				}

				res.render('editarticle', {ttitle: title, smallID: smallID, article : result, villages : villages, regions : lists, hide:req.query.hide, isSuperAdmin: !req.session.typeid, username: req.session.username});
	
			});

		});

	});
});


router.post('/modify', function(req, res, next){
	//登录验证
	if(!req.session.username){
		res.render('fail', {title: "页面错误", message : ""});
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
	    // console.log(fields);
	    // console.log(files);



		var title = fields.ttitle;
		var smallID = fields.smallID;

	    var article = [];
	    article["id"] = fields.articleid;
	    article["title"] = fields.title;
	    article["content"] = fields.content;
	    article["regionid"] = fields.regionid;
	    article["categoryid"] = fields.categoryid;
	    article["uploadtime"] = Date.parse(new Date());

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

		sql.adminEventModifyOne(article, function(err){
			if(err){
				res.render('fail', {title : "修改失败", message: "数据库出现错误"});
			    return;
			}

	    	//跳转到主页面
			res.redirect("/admin_event/details?ttitle=" + title+"&id="+smallID);
		});

		
    });



});



module.exports = router;