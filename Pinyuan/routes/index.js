var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/index', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.get('/openaffairs', function(req, res, next) {
  res.render('openaffairs', { title: 'Express' });
});
/* GET login page*/
router.get('/admin', function(req, res, next) {
  res.render('admin_index', { title: 'Express' });
});
/* GET login page*/
router.get('/magcountry', function(req, res, next) {
  res.render('magcountry', { title: 'Express' });
});
router.get('/project', function(req, res, next) {
  res.render('project', { title: 'Express' });
});
router.get('/policy', function(req, res, next) {
  res.render('policy', { title: 'Express' });
});
module.exports = router;
