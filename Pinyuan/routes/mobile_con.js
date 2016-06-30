var express = require('express');
var router = express.Router();
var sql = require('./sql');


router.get('/region',function(req,res,next){
	sql.connect();
	sql.selectTownFromRegion(function(err,results){
		if(err){
			console.log("----- 4***** -----");
			console.log("error:"err.message);
			return;
		}
		selectVillageFromRegion(results,function(err,results2){
			if(err){
				console.log("----- 5***** -----");
				console.log("error:"err.message);
				return;
			}
			var value = new Array();
			var town = "";
			var super = 0;
			for (var i = results.length - 1; i >= 0; i--) {
				town = results[i].name;
				super = results.super;
				var set = new Array();
				for (var j = results2.length - 1; j >= 0; j--) {
					if(results2[j].super = super ) {
						set.push(results2[j]);
					}
				}
				value[town] = set;

			}
			var ret = {'value':value,'status':'success'};
			res.send(ret);

		});
	});
});

router.get('/list',function(req,res,next){
	var regionid = req.query.regionid;
	var tag = req.query.tag;
	var lastupload = req.query.lastupload;
	var sinceupload = req.query.lastupload;
	sql.connect();
	sql.selectFromEventByTag(tag, regionid, lastupload, lastupload, function(err,results){
		if(err){
			console.log("----- 6***** -----");
			console.log("error:"err.message);
			return;
		}

		var ret = {'value':results,'status':'success'};
		res.send(ret);

	});
});

router.get('/detail',function(req,res,next){
	var id = req.query.id;
	var url = "/web_con/detail?id="+id;
	var ret = {'url':url};
	res.send(ret);
});

module.exports = router;