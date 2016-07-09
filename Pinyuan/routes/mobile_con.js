var express = require('express');
var router = express.Router();
var sql = require('./sql');


router.get('/region',function(req,res,next){
	sql.connect();
	sql.selectTownFromRegion([],function(err,results){
		if(err){
			console.log("----- 4***** -----");
			console.log("error:"+err.message);
			return;
		}
		// console.log("----- 4***** -----");
		// console.log(results);
		sql.selectVillageFromRegion(results,function(err,results2){
			if(err){
				console.log("----- 5***** -----");
				console.log("error:"+err.message);
				return;
			}
			// console.log("----- 4***** -----");
			// console.log(results2);
			var value = new Array();
			
			var super1 = 0;
			for (var i = results.length - 1; i >= 0; i--) {
				
				super1 = results[i].id;
				var tmp = results[i];
				var set = new Array();

				for (var j = results2.length - 1; j >= 0; j--) {
					if(results2[j].super == super1 ) {
						set.push(results2[j]);
					}
				}

				tmp.village = set;
				value.push(tmp);
				// console.log("----- 5***** -----");
				// console.log(set);

			}
			// console.log("----- r***** -----");
			// console.log(results);
			// console.log("----- r2***** -----");
			// console.log(results2);
			var ret = {'value':results,'status':'success'};
			// console.log("----- value -----");
			// console.log(value.length);
			// console.log(ret);
			res.send(ret);
			sql.end();

		});
	});
});

router.get('/list',function(req,res,next){
	var regionid = req.query.regionid;
	// var tag = req.query.tag;
	// var lastupload = req.query.lastupload;
	// var sinceupload = req.query.lastupload;
	sql.connect();
	// sql.selectFromEventByTag(tag, regionid, lastupload, lastupload, function(err,results){
	sql.selectFromEventByRegeionid(regionid, function(err,results){
		if(err){
			console.log("----- 6***** -----");
			console.log("error:"+err.message);
			return;
		}

		var value = new Array();
		var value_1 = new Array();
		var value_2 = new Array();
		var value_3 = new Array();
		var value_4 = new Array();

		for (var i = results.length - 1; i >= 0; i--) {
			results[i].content = "";
			if(results[i].categoryid == 1){
				value_1.push(results[i]);
			}

			if(results[i].categoryid == 2){
				value_2.push(results[i]);
			}

			if(results[i].categoryid == 3){
				value_3.push(results[i]);
			}

			if(results[i].categoryid == 4){
				value_4.push(results[i]);
			}
		}


		value.push(value_1);
		value.push(value_2);
		value.push(value_3);
		value.push(value_4);


		var ret = {'value':value,'status':'success'};
		res.send(ret);
		sql.end();

	});
});

router.get('/detail',function(req,res,next){
	var id = req.query.id;
	var url = "/web_con/detail?id="+id;
	var ret = {'url':url};
	res.send(ret);
});

module.exports = router;