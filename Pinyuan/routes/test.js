var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('test', { title: 'Express' });
});
router.post('/', function(req, res, next) {

	 var content=req.body.content1;
	 console.log("nihao"+content);  
   // res.render('test', { title: 'Express' });
   res.send(content);
});
router.post('/image', function(req, res, next) {

	 // var content=req.body.content1;
	 // console.log("nihao"+content);  
   // res.render('test', { title: 'Express' });
   res.send(content);
});

module.exports = router;

