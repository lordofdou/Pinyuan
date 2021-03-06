var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//session
var session = require('express-session');
// var orm = require('orm');
var session = require('express-session');
var domain = require('domain');
var routes = require('./routes/index');
var users = require('./routes/users');


/**
*测试
*/
var test = require('./routes/test');

/**
*后台管理
*/
//管理员登录
var admin_login = require('./routes/admin_login');
//管理数据管理人员信息
var admin_dataman = require('./routes/admin_dataman');
//管理乡镇信息
var admin_region = require('./routes/admin_region');
//管理惠农政策
var admin_policy = require('./routes/admin_policy');
//管理惠农项目
var admin_project = require('./routes/admin_project');
//管理村务数据(数据管理人员项)
var admin_event = require('./routes/admin_event');





/*＊
*Android&iOS
*/
//Android&iOS政策项目模块
var mobile_gov = require('./routes/mobile_gov');
//Android&iOS村务模块
var mobile_con = require('./routes/mobile_con');
//Android&iOS搜索模块
var mobile_search = require('./routes/mobile_search');


/**
*Web
*/
//Web政策项目模块
var web_gov = require('./routes/web_gov');
//Web村务模块
var web_con = require("./routes/web_con");
//Android&iOS搜索模块
var web_search = require('./routes/web_search');

var d = domain.create();

var app = express();
// var app;
process.on('uncaughtException', function (err) {
    console.log('Caught exception: ', err);
});
// d.on('error', function(err) {
//   console.log(err.message);
// });

// d.run(function() {
//   try{
    // app = express();

// view engine setup
      app.set('views', path.join(__dirname, 'views'));
      app.set('view engine', 'ejs');

      //跨域
      app.all('*', function(req, res, next) {
          res.header("Access-Control-Allow-Origin", "*");
          res.header("Access-Control-Allow-Headers", "X-Requested-With");
          res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
          res.header("X-Powered-By",' 3.2.1')
          // res.header("Content-Type", "application/json;charset=utf-8");
          next();
      });
      //session
      app.use(session({
        secret: 'helloxjlkioalng98349247', // 建议使用 128 个字符的随机字符串
        cookie: { maxAge: 10000*60*60 }
      }));

      // uncomment after placing your favicon in /public
      //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
      app.use(logger('dev'));
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: false }));
      app.use(cookieParser());
      app.use(express.static(path.join(__dirname, 'public')));
      app.use(session({
        secret: 'asdfljaoefawfaertepotgmsdfg139u290', 
        cookie: { maxAge: 1000*60*60 }
      }));



      app.use('/', routes);
      app.use('/users', users);

      app.use('/test',test);

      app.use('/admin_login',admin_login);
      app.use('/admin_dataman',admin_dataman);
      app.use('/admin_region',admin_region);
      app.use('/admin_policy',admin_policy);
      app.use('/admin_project',admin_project);
      app.use('/admin_event',admin_event);


      app.use('/mobile_gov',mobile_gov);
      app.use('/mobile_con',mobile_con);
      app.use('/mobile_search',mobile_search);

      app.use('/web_gov',web_gov);
      app.use('/web_con',web_con);


      // catch 404 and forward to error handler
      app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
      });

      // error handlers

      // development error handler
      // will print stacktrace
      if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
          res.status(err.status || 500);
          res.render('error', {
            message: err.message,
            error: err
          });
        });
      }

      // production error handler
      // no stacktraces leaked to user
      app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
          message: err.message,
          error: {}
        });
      });

//   }catch(err){
//     // throw err;
//   }
  
// });

module.exports = app;
