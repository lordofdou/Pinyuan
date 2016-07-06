var express = require('express');
var router = express.Router();
var sql = require('./sql');

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

	
});

module.exports = router;