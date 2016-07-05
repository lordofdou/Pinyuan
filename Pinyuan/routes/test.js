var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/test', function(req, res, next) {
  res.render('test', { title: 'Express' });
});
router.post('/test', function(req, res, next) {

	// var content=req.body.content1;
	// console.log("nihao"+content);  
   res.render('test', { title: 'Express' });
});
