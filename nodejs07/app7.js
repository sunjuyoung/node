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

var user = require('./routes/user');

var app = express();

// 기본 속성 설정
app.set('port', process.env.PORT || 3000);

mongoose.set('useCreateIndex', true);

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

      createUserSchema(database);

    

     // UserModel = mongoose.model("users",UserSchema);
      //UserModel = mongoose.model("users2",UserSchema);
  })

  database.on('disconnected',function(){
      console.log("db 연결 끊어졌습니다 5초 후 다시 연결");
      setInterval(connectDB,5000);
  })


}

// user 스키마 및 모델 객체 생성
function createUserSchema(database){
    //user_schema 모듈 불러오기
    UserSchema = require('./database/user_schema').createSchema(mongoose);

    UserModel = mongoose.model('user2',UserSchema);
    console.log('usermodel 정의');
}




//라우터
var router = express.Router();

//로그인
router.route('/process/login').post(user.login);

//사용자 추가
router.route('/process/addUser').post(user.adduser);

//사용자 리스트
router.route('/process/listUser').get(user.listuser);


app.use('/',router);

//사용자 인증 함수
var authUser = function(database,id,password,callback){
    console.log('authUser 호출됨 : ' + id + ', ' + password);
   
    //아이디를 먼저 검색
    UserModel.findById(id,function(err,result){
        if(err){
            callback(err,null);
            return;
        }

        if(result.length>0){
            console.log("아이디 찾음");


            if(result[0]._doc.password===password){
                console.log("비밀번호 일치");
                callback(null,result);
            }else{
                 console.log("비밀번호 일치하지 않음");
                 callback(null,null);
            }

          
        }else{
            console.log('일치하는 사용자를 찾ㅈ ㅣ못함');
            console.log(null,null);
        }
    })
}

//사용자 추가
var addUser = function(database,id,pw,name,age,callback){
    console.log('addUser func');

    var user = UserModel({'id':id,'password':pw,'name':name,'age':age});
    user.save(function(err){
        if(err){
            callback(err,null);
            return;
        }
        console.log("추가 완료");
        console.dir(user);
        callback(null,'user');
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

