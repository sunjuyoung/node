/**
 * 
 * 
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

var mongoose = require('mongoose');

var app = express();

// 기본 속성 설정
app.set('port', process.env.PORT || 3000);

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

var UserSchema;

var UserModel;

var database;

function connectDB(){
    //데이터베이스 연결 정보
	var databaseUrl = 'mongodb://localhost:27017/local';

    //연결
  // mongoose.Promise = global.Promise; 
  mongoose.connect(databaseUrl);
  database = mongoose.connection;

  database.on('error',console.error.bind(console,'mongoose connection error'));
  database.on('open',function(){
      console.log('db 연결');

      UserSchema = mongoose.Schema({
          id:String,
          name:String,
          password:String
      })

      UserModel = mongoose.model("users",UserSchema);
  })

  database.on('disconnected',function(){
      console.log("db 연결 끊어졌습니다 5초 후 다시 연결");
      setInterval(connectDB,5000);
  })


}





//라우터
var router = express.Router();

//로그인
router.route('/process/login').post(function(req,res){
    console.log('/process/login');

    var paramId =  req.body.id;
    var paramPassword = req.body.password;

    if(database){
        authUser(database,paramId,paramPassword,function(err,docs){
            if(err) throw err;

            if(docs){
                console.dir(docs);
                var username= docs[0].name;
                res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>로그인 성공</h1>');
                res.write('<div>'+paramId+'</div>');
                res.write('<div>'+paramPassword+'</div>');
                res.end();

            }else{
                res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>로그인 실패</h1>');
                res.write('<h1>일치하는 사용자 없음</h1>');
                res.end();
            }
        })
    }else{
        res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
        res.write('<h1>데이터베이스 연결 실패</h1>');
        res.end();
    }
})

router.route('/process/addUser').post(function(req,res){
    console.log('/process/addUser');

    var paramId =  req.body.id;
    var paramPassword = req.body.password;
    var paramName = req.body.name;

    if(database){
        addUser(database,paramId,paramPassword,paramName,function(err,result){
            if(err) throw err;

            if(result && result.insertedCount >0){
                console.dir(result);

                res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>사용자 추가 성공</h1>');
                res.write('<h1><a href="/public/loginForm_01.html">이동</a></h1>');
                res.end();

            }

        })
    }
})

app.use('/',router);

//사용자 인증 함수
var authUser = function(database,id,password,callback){
    console.log('authUser 호출됨 : ' + id + ', ' + password);
   

    //아이디와 비밀번호를 사용해 검색
    UserModel.find({'id':id, 'password':password},function(err,result){
        if(err){
            callback(err,null);
            return;
        }

        if(result.length>0){
            callback(null,result);
        }else{
            console.log('일치하는 사용자를 찾ㅈ ㅣ못함');
            console.log(null,null);
        }

    })

   
}

//사용자 추가
var addUser = function(database,id,pw,name,callback){
    console.log('addUser func');

    var user = UserModel({'id':id,'password':pw,'name':name});
    user.save(function(err){
        if(err){
            callback(err,null);
            return;
        }
        console.log("추가 완료");
        callback(null,user);
    })


}


//404
var errorHandler = expressErrorHandler({
    static:{
        '404':'./public/404.html'
    }
});
app.use( expressErrorHandler.httpError(404) );
app.use( errorHandler );

http.createServer(app).listen(app.get('port'),function(){
    console.log(app.get('port')+'포트연결');
    connectDB();
})

