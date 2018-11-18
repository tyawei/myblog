var environment=process.env.NODE_ENV;
var webpack=require('webpack');
var config;

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var ejs = require('ejs');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session=require('express-session');
// var consolidate = require('consolidate');
// var multer=require('multer');
// var fs=require('fs');
var app = express();

if (environment==='production') {
  config=require('../webpack.config.prod.js');
} else if (environment==='development') {
  config=require('../webpack.config.dev.js');
} else {
  console.log('Please define NODE_ENV first');
}
// if (environment==='development') {
//   config=require('../webpack.config.dev.js');
// }
// config=require('../webpack.config.prod.js');

var compiler=webpack(config);
if (environment==='development') {
  var WebpackHotMiddleware=require('webpack-hot-middleware');
  app.use(WebpackHotMiddleware(compiler));
} else {
  var WebpackDevMiddleware=require('webpack-dev-middleware');
  app.use(WebpackDevMiddleware(compiler, { 
    noInfo: true, 
    publicPath: config.output.publicPath 
  }));
}
  

var conn=require('./conn.js');

// app.set('port', process.env.PORT || 8888 );

// view engine setup
app.engine('.html', ejs.__express);
app.set('view engine', 'html'); 
app.set('views', path.join(__dirname, '../'));

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('express_cookies'));
app.use(session({
  secret: 'express_cookies',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 1000*3600*24 }
}))
app.use(express.static(path.join(__dirname, '../')));
// app.use(express.static('/public')); //在public文件夹新建index.html静态文件


//CORS跨域请求设置
app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

app.use( '/check', require('./loginRegist.js'));
app.use( '/articlelist', require('./articleList.js') );
app.use( '/admin', require('./admin/catagory.js') );
app.use( '/admin', require('./admin/friend.js') );
app.use( '/admin', require('./admin/users.js') );
app.use( '/article', require('./article.js') );
app.use( '/comment', require('./comment.js') );
app.use( '/articlecata', require('./articleCata.js') );
app.use( '/file', require('./file.js') );
app.use( '/sider', require('./sider.js') );
app.use( '/friend', require('./friend.js') );

app.post( '/logout', function(req, res) {
  req.session.userInfo=null;
  res.sendFile(path.join(__dirname, "../", "index.html"));
})
if (environment==="production") {
  app.get( ['/add', '/edit', '/admin'], function(req, res) {
    var data=req.session.userInfo;
    if (data.userName==="admin" && data.userType==="admin") {
      res.sendFile(path.join(__dirname, "../", "index.html"));
    } else {
      //转入非法提示页面
      res.sendFile(path.join(__dirname, "../", "noRight.html"));
    }
  })

  app.get( ['/catagory', '/friend', '/article', '/file'], function(req, res) {
    res.sendFile(path.join(__dirname, "../", "index.html"));
  })


  // app.get("*", function(req, res) {
  //   res.sendFile(path.join(__dirname, "../", "404.html"));
  // })
}
  

//这儿的问题，一定把业务代码写在上面
// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

app.use(function(err, req, res, next) {
  if (err) {
   console.log("出错啦："+err, "错误信息："+err.message); 
  }
  next();
})

app.listen(3000, function(err) {  
  if (err) {
    console.error(err);
  } else {
    console.log("listen on port 3000");
  }
})



// 解决文章编辑器和md语法问题
//    支持markdown： react-lz-editor(有未知的问题)   react-draft-wysi  draft.js(烂)
//    其他： react-quill(不支持md)  react-markdown wangeditor

