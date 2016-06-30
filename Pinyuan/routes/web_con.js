var express = require('express');
var router = express.Router();
var sql = require('./sql');

router.get('/detail',function(req,res,next){
	var id = req.query.id;
	

	sql.connect();
	sql.selectAsDetailFromEvent(id,function(err,results){
		if(err){
			console.log("----- 7***** -----");
			console.log("error:"err.message);
			return;
		}
	
		res.render('web_cov_detail',{title:results.title,content:results.content,image:results.image});
	});
});

module.exports = router;