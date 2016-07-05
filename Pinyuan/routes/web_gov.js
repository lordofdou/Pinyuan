var express = require('express');
var router = express.Router();
var sql = require('./sql');

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
	
		res.render('web_gov_detail',{title:results.title,content:results.content,image:results.image});
	});
});

module.exports = router;