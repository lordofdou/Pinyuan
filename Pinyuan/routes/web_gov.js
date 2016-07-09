var express = require('express');
var router = express.Router();
var sql = require('./sql');


router.get('/index',function(req,res,next){
	sql.connect();
	sql.selectAsPagination(0,function(err,results){
		if(err){
			console.log("----- 1***** -----");
			console.log("error:"+err.message);
			return;
		}
		var allcontent = new Array();
		allcontent.pagination = results;
		sql.selectFromPolicyAsList(allcontent,function(err,results2){
			if(err){
				console.log("----- 2***** -----");
				console.log("error:"+err.message);
				return;
			}
			for (var i = results2.length - 1; i >= 0; i--) {
				
				results2[i].content = "";
			}
			allcontent.policy = results2;
			

			sql.selectFromProjectAsList(allcontent,function(err,results3){
				if(err){
					console.log("----- 3***** -----");
					console.log("error:"+err.message);
					return;
				}
				for (var i = results3.length - 1; i >= 0; i--) {
					
					results3[i].content = "";
				}

				allcontent.project = results3;
				sql.selectTownFromRegion(allcontent,function(err,results4){
					if(err){
						console.log("----- 4***** -----");
						console.log("error:"+err.message);
						return;
					}

					sql.selectFromEventBySuperid(allcontent,results4,function(err,results5){
						if(err){
							console.log("----- 5***** -----");
							console.log("error:"+err.message);
							return;
						}

						var name;
						var superid = 0;
						var event = new Array();

						for (var i = results4.length - 1; i >= 0; i--) {
							name = results4[i].name;
							superid = results4[i].super;
							var cell = new Array();
							cell.id = results4[i].id;
							cell.name = name;
							cell.article = new Array();
							for (var j = results5.length - 1; j >= 0; j--) {
								results5[j].content = "";
								if(results5[j].super == superid) {
									cell.article['id'] = results5[j].id;
									cell.article['title'] = results5[j].title;
									cell.article['uploadtime'] = results5[j].uploadtime;
								}
							}
							event.push(cell);
						}

						// res.render('web_gov_index',{'pagination':allcontent.pagination,
													// 'policy':allcontent.policy,
													// 'project':allcontent.project,
													// 'event':event});
						res.send({'pagination':allcontent.pagination,
													'policy':allcontent.policy,
													'project':allcontent.project,
													'event':event});
						sql.end();
					});

				});

			});
		});

	});
});

router.get('/detail',function(req,res,next){
	var id = req.query.id;
	var type = req.query.type;

	sql.connect();
	sql.selectAsDetail(type,id,function(err,results){
		if(err){
			console.log("----- 3***** -----");
			console.log("error:"+err.message);
			return;
		}
		res.send({title:results[0].title,content:results[0].content,image:results[0].image,uploadtime:results[0].uploadtime});
		// res.render('web_gov_detail',{title:results.title,content:results.content,image:results.image});
		// console.log("----- 3***** -----");
		// res.send(results[0].content);
		// console.log(results);
		sql.end();
	});
});

router.get('/pagdetail',function(req,res,next){
	var uploadtime = req.query.uploadtime;
	

	sql.connect();
	sql.selectAsDetailByUploadTime(uploadtime,function(err,results){
		if(err){
			console.log("----- 11***** -----");
			console.log("error:"+err.message);
			return;
		}
		res.send({title:results.title,content:results.content,image:results.image});
		// res.render('web_gov_detail',{title:results.title,content:results.content,image:results.image});
		sql.end();
	});
});

router.get('/more',function(req,res,next){
	var tag = req.query.tag;//惠农政策0／惠农项目1／村务公开2
	var id = req.query.id;//id：惠农政策和项目设置为0，村务公开为相应乡镇id
	if(tag==2){
		res.redirect('/web_gov/list?tag='+tag+'&lasttime=0');
	}else{
		res.redirect('/web_con/list?id='+id);
	}
});

router.get('/list',function(req,res,next){
	var tag = req.query.tag;
	var lasttime = req.query.lasttime;
	sql.connect();
	sql.selectFromPolicyOrProjectByTime(tag,lasttime,function(err,results){
		if(err){
			console.log("----- 11***** -----");
			console.log("error:"+err.message);
			return;
		}
		var ret = {'value':results};
		res.send(ret);
		sql.end();

	});
});

module.exports = router;