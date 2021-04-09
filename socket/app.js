
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const session = require("express-session");
const FileStore = require('session-file-store')(session);
//导入session回话并且进行配置如下。中间介

const sessionMiddleware = session({
   // store:new FileStore(),  // 持久华 ？？，
/*
 win10系统，点击退出的时候没有效果，当 store:new FileStore()注释的时候就有效果了
 ？？
*/
    secret: 'keyboard cat',
   cookie: { maxAge: 80000 }
});
var iosession=require("express-socket.io-session")(session); // iosession
var index = require('./routes/index');
var users = require('./routes/users');
var login2=require("./routes/login2");

var app = express();
//时间处理函数
function timeDo(){
var time=new Date();
var year=time.getFullYear();
var month=time.getMonth()+1;
var date=time.getDate();
var hours=time.getHours();
var mint=time.getMinutes();
var seconds=time.getSeconds();
var mill=time.getMilliseconds()
const time2=year+" "+month+"月"+date+"号"+"|"+hours+":"+mint+":"+seconds ;
return time2;
}
var server=require("http").Server(app);//创建server对象
var io=require('socket.io')(server);
 server.listen(3000); //使用3000访问端口，用node app使用
io.use(iosession);
//聊天


io.on("connection",function(socket){
  socket.emit("say","测试一下");
})

/*
io.on("connection",function(socket){
  socket.on("say",function(date){
 console.log(date);
    // socket.emit("send-say", data + "---" + timeDo());
    socket.handshake.session.save();
io.emit("send-say", date + "---" + timeDo() );
});
})

*/


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
 app.use(sessionMiddleware);//session
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/login2',login2)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
console.log(err);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// module.exports = app;
