var express = require('express');
var router = express.Router();
var sql = require('./sql');

router.get('/pagination',function(req,res,next){
	var tag = req.query.tag;
	sql.connect();
	sql.selectAsPagination(tag,function(err,results){
		if(err){
			console.log("----- 1***** -----");
			console.log("error:"+err.message);
			return;
		}
		var ret = {'value':results,'status':'success'};
		res.send(ret);
	});
	
});

router.get('/list',function(req,res,next){
	
	var tag = req.query.tag;
	var lastupload = req.query.lastupload;
	var sinceupload = req.query.sinceupload;
	sql.connect();
	sql.selectAsList(tag,lastupload,sinceupload,function(err,results){
		if(err){
			console.log("----- 2***** -----");
			console.log("error:"+err.message);
			return;
		}
		for (var i = results.length - 1; i >= 0; i--) {
			var content = results[i].content;
			results[i].content = content.substring(0,50);
		}
		var ret = {'value':results,'status':'success'};
		res.send(ret);
	});

	
});

router.get('/detail',function(req,res,next){
	var id = req.query.id;
	var type = req.query.type;
	var url = "/web_gov/detail?type="+type+"&id="+id;
	var ret = {'url':url};
	res.send(ret);
})

module.exports = router;