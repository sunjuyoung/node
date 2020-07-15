/**
 * multipart , cors
 * @date
 * 
 */
var express = require('express')
    ,http = require('http')
    ,path = require('path');


//Cookie
var cookieParser = require('cookie-parser');

//session
var expressSession = require('express-session');

//express-error-handler
var expressErrorHandler = require('express-error-handler');

//Express 미들웨어 불러오기
var bodyParser = require('body-parser');
var static = require('serve-static');


//파일 업로드용 미들웨어
var multer = require('multer');
var fs = require('fs');

//ajax요청했을때 cors(다중 서버접속) 지원
var cors = require('cors');

var app = express();

app.set('port',process.env.PORT||3000);

//bodyparser사용하여 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({extended:false}));

//application/json 파싱
app.use(bodyParser.json());

//특정 폴더의 파일들을 특정 패스로 접근할수있도록 만든다.
//path와 public을 합친다 경로 셋팅
//public 안에 있는 파일을 곧바로 쓸수 있다
app.use(static(path.join(__dirname,'public')));
app.use(static(path.join(__dirname,'uploads')));


app.use(cookieParser());
app.use(expressSession({
    secret:'my key',
    resave:true,
    saveUninitialized:true
}));

app.use(cors());

//multer 미들웨어 사용  body-parser -> multer -> router
var storage = multer.diskStorage({
    destination:function(req,file,callback){ //업로드한 파일이 저장될 폴더 지정
        callback(null,'uploads');
    },
    filename:function(req,file,callback){
        callback(null,file.originalname+Date.now());
    }
})

var upload = multer({
    storage:storage,
    limits:{
        files:10,
        fileSize:1024*1024*1024
    }
})


//라우터 객체 참조
var router = express.Router();

router.route('/process/photo').post(upload.array('photo',1),function(req,res){
    console.log("/process/photo 처리");

    try{
        var files = req.files;

        if(Array.isArray(files)){
            console.log(files.length);
        }
    }catch(err){

    }
});

router.route('/process/login/:what').post(function(req,res){
    console.log("/process/login 처리");
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    var name = req.params.what;

    res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
    res.write('<h1>Express 응답 결과</h1>');
    res.write('<div>'+paramId+'</div>');
    res.write('<div>'+paramPassword+'</div>');
    res.write('<div>'+name+'</div>');
    res.end();
})


//라우터객체 app객체에 등록
app.use('/',router);


//모든 route처리가 끝난 후 404오류 페이지 처리
var errorHandler = expressErrorHandler({
    static:{
        '404':'./public/404.html'
    }
})

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);


http.createServer(app).listen(app.get('port'),function(){
    console.log("3000포트");
})