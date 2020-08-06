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

      UserSchema = mongoose.Schema({
          id:{type:String,required:true,unique:true},
          name:{type:String,index:'hashed'},
          password:{type:String,required:true},
          age:{type:Number,required:true},
          created_at : {type:Date,index:{unique:false},'default':Date.now},
          updated_at : {type:Date,index:{unique:false},'default':Date.now}
      })

      //스키마 static메소드 추가
      UserSchema.static('findById',function(id,callback){
          return this.find({id:id},callback);
      })
      UserSchema.static('findAll',function(callback){
          return this.find({},callback);
      })

     // UserModel = mongoose.model("users",UserSchema);
      UserModel = mongoose.model("users2",UserSchema);
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
                res.write('<div><a href="/process/listUser">리스트</a></div>');
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

//사용자 추가
router.route('/process/addUser').post(function(req,res){
    console.log('/process/addUser');

    var paramId =  req.body.id;
    var paramPassword = req.body.password;
    var paramName = req.body.name;
    var paramAge = req.body.age;

    if(database){
        addUser(database,paramId,paramPassword,paramName,paramAge,function(err,result){
            if(err) throw err;


            if(result === 'user'){

                res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>사용자 추가 성공</h1>');
                res.write('<h1><a href="/public/loginForm_01.html">이동</a></h1>');
                res.end();

            }

        })
    }
})

//사용자 리스트
router.route('/process/listUser').get(function(req,res){
    console.log('/process/listUser');

    if(database){
        UserModel.findAll(function(err,result){
            if(err){
                console.log("리스트 조회 에러");

                res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>리스트 조회 에러</h1>');
                res.write('<p>'+err.stack+'</p>');
                res.end();
                
                return;
            }

            if(result){ //결과 있으면 리스트 전송
                res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>리스트 조회 </h1>');
                res.write('<div><ul>');
                for(var i=0; i<result.length; i++){
                    var id_ = result[i]._doc.id;
                    var name_ = result[i]._doc.name;
                    res.write('<li>#'+i+':'+id_+','+name_+'</li>');
                }
                
                res.write('</ul></div>');
                res.end();
               

            }else{
                res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>리스트 조회 실패</h1>');
                res.end();
            }



        })
    }
})

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

