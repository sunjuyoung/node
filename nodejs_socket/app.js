/**
 * soketio
 * 
 */
var user = require('./routes/user');

var express = require('express');
var http = require('http');
var path = require('path');

//Express 미들웨어
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var static = require('serve-static');
var errorHandler = require('errorhandler');

//오류 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler');

//session
var expressSession = require('express-session');

//mysql
var mysql = require('mysql');

//passport
var passport = require('passport');
var flash = require('connect-flash');

var socketio = require('socket.io');

var cors = require('cors');

var app = express();

// 기본 속성 설정
app.set('port', process.env.PORT || 3000);

//뷰 엔진(ejs) 설정
app.set('views',__dirname+'/views');
app.set('view engine','ejs');

app.use(cors());

// body-parser를 이용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({ extended: false }))

// body-parser를 이용해 application/json 파싱
app.use(bodyParser.json())

// public 폴더를 static으로 오픈
app.use('/public', static(path.join(__dirname, 'public')));
 
// cookie-parser 설정
app.use(cookieParser());

// 세션 설정
app.use(expressSession({
	secret:'my key',
	resave:true,
	saveUninitialized:true
}));

//passport 사용 설정
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

var LocalStrategy = require('passport-local').Strategy;

//라우터
var router = express.Router();

router.route('/process/login').post(user.login);
router.route('/process/addUser').post(user.adduser);
router.route('/process/listUser').get(user.listuser);

app.use('/',router);


//404
var errorHandler = expressErrorHandler({
    static:{
        '404':'./public/404.html'
    }
});
app.use( expressErrorHandler.httpError(404) );
app.use( errorHandler );

var server = http.createServer(app).listen(app.get('port'),function(){
    console.log(app.get('port')+'포트연결');
    
})


var io = socketio.listen(server);
console.log('soket.io 요청 준비');

io.sockets.on('connection',function(socket){
    console.log('connection info : ',socket.request.connection._peername);

    socket.remoteAddress = socket.request.connection._peername.address;
    socket.remotePort = socket.request.connection._peername.port;
})

