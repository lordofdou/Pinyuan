var express = require('express');
var router = express.Router();
// var sql = require('./sql');
var maintainer = require('./seqModel').maintainer;

router.get('/',function(req,res,next){
//get:req.query.xxx
//post:req.body.xxx
});

module.exports = router;