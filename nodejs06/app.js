/**
 * 몽고디비 연결
 */

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

var app = express();

app.set('port',process.env.PORT || 3000);
app.use( static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.use(expressSession({
    secret:'my key',
    resave:true,
    saveUninitialized:true
}))

//몽고디비 모듈
var MongoClient = require('mongodb').MongoClient;

var database;

function connectDB(){
    //데이터베이스 연결 정보
	var databaseUrl = 'mongodb://127.0.0.1:27017/local';

    //연결
    MongoClient.connect(databaseUrl,{useUnifiedTopology: true},function(err,db){
        if(err) console.log('db에러러러러러러');

        console.log('db연결');
        database = db;
    })
}

var router = express.Router();
router.route('/process/test').get(function(req,res){
    console.log('/process/test');

});


router.route('/process/login').post(function(req,res){
    console.log('/process/login');

    var paramId = req.params('id');
    var paramPassword = req.params('password');

    if(database){
        authUser(database,paramId,paramPassword,function(err,docs){
            if(err) throw err;

            if(docs){
                console.log(docs);
                var username= docs[0].name;
                res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>로그인 성공</h1>');
                res.write('<div>'+paramId+'</div>');
                res.write('<div>'+paramPassword+'</div>');
                res.end();

            }else{
                res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>로그인 실패</h1>');
                res.write('<h1>로그인 실패</h1>');
                res.end();
            }
        })
    }else{
        res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
        res.write('<h1>데이터베이스 연결 실패</h1>');
        res.end();
    }
})

app.use('/',router);

//사용자 인증 함수
var authUser = function(database,id,password,callback){
    console.log('authUser');
    //users 컬렉션 참조
    var users = database.collection('users');

    //아이디와 비밀번호를 사용해 검색
    users.find({'id':id, 'password':password}).toArray(function(err,docs){
        if(err) callback(err,null);
        
        if(docs.length >0){
            console.log('아이디 %s , 비밀번호 %s 가 일치하는 사용자 찾음',id,password);
            callback(null,docs);
        }else{
            console.log('일치하는 사용자 찾지 못함');
            callback(null,null);
        }
    })
}
//404
var errorHandler = expressErrorHandler({
    static:{
        '404':'./public/404.html'
    }
});
app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

http.createServer(app).listen(app.get('post'),function(){
    console.log(app.get('port')+'포트연결');
  //  connectDB();
})