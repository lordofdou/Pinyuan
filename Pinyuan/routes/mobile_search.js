var express = require('express');
var router = express.Router();
var sql = require('./sql');


router.get('/',function(req,res,next){
	var tag = req.query.tag;
	var key = req.query.key;

	sql.connect();
	sql.globalSearch(tag,key,function(err,results){
		if(err){
			console.log("----- 9***** -----");
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

module.exports = router;