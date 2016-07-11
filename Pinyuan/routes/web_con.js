var express = require('express');
var router = express.Router();
var sql = require('./sql');

router.get('/detail',function(req,res,next){
	var id = req.query.id;
	

	sql.connect();
	sql.selectAsDetailFromEvent(id,function(err,results){
		if(err){
			// console.log("----- 7***** -----");
			// console.log("error:"+err.message);
			return;
		}
		res.send({title:results[0].title,content:results[0].content,image:results[0].image,uploadtime:results[0].uploadtime});
		// res.render('web_cov_detail',{title:results.title,content:results.content,image:results.image});
		sql.end();
	});
});

router.get('/region',function(req,res,next){
	sql.connect();
	sql.selectTownFromRegion([],function(err,results){
		if(err){
			// console.log("----- 4***** -----");
			// console.log("error:"+err.message);
			return;
		}
		sql.selectVillageFromRegion(results,function(err,results2){
			if(err){
				// console.log("----- 5***** -----");
				// console.log("error:"+err.message);
				return;
			}
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
	var id = req.query.id;
	sql.connect();
	sql.selectFromEventByRegeionid(id,function(err,results){
		if(err){
			console.log("----- 4***** -----");
			console.log("error:"+err.message);
			return;
		}
		var value_1 = new Array();
		var value_2 = new Array();
		var value_3 = new Array();
		var value_4 = new Array();
		for (var i = results.length - 1; i >= 0; i--) {
			if(results[i].id = 1) {
				value_1.push(results[i]);
			}
			if(results[i].id = 2) {
				value_2.push(results[i]);
			}
			if(results[i].id = 3) {
				value_3.push(results[i]);
			}
			if(results[i].id = 4) {
				value_4.push(results[i]);
			}

		}
		ret={'value_1':value_1,'value_2':value_2,'value_3':value_3,'value_4':value_4};
		res.send(ret);
		sql.end();
	});
})

router.get('/more',function(req,res,next){
	var id = req.query.id;
	var tag = req.query.tag;//党务公开1／村务公开2／财务公开3／惠农资金4
	var lasttime = req.query.lasttime;//uploadtime最小的村务id，第一次加载为0
	sql.connet();
	sql.selectFromEventByTime(id,tag,lasttime,function(err,results){
		if(err){
			// console.log("----- 4***** -----");
			// console.log("error:"+err.message);
			return;
		}
		res.send(results);
		sql.end();
	});
})

module.exports = router;