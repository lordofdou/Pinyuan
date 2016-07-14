var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.send("<script> alert('hello') </script>");
  	res.render('test', { title: 'Express' });
});






// router.post('/', function(req, res, next) {

// 	 var content=req.body.content1;
// 	 console.log("nihao"+content);  
// 	 console.log("nihao"+req.query.dir); 
// 	 var str={error:0 ,url:'https://www.baidu.com/img/bd_logo1.png'};
//    // res.render('test', { error: '0' ,url:'https://www.baidu.com/img/bd_logo1.png'});
//    res.send(str);
// });
// router.get('/image', function(req, res, next) {

// 	 // var content=req.body.content1;
// 	  console.log("nihao");  
//    //res.render('test', { title: 'img' });
//    // res.send(content);
// });
// router.post('/image', function(req, res, next) {

// 	 var content=req.body.content1;
// 	console.log("nihao");  
//    //res.render('test', { title: 'img' });
//     res.send(content);
// });



module.exports = router;

