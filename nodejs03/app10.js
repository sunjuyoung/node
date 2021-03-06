/**
 * session
 * @date
 * 
 */
var express = require('express')
    ,http = require('http')
    ,path = require('path');
//라우터 객체 참조
var router = express.Router();

//Cookie
var cookieParser = require('cookie-parser');

//session
var expressSession = require('express-session');

//express-error-handler
var expressErrorHandler = require('express-error-handler');

//Express 미들웨어 불러오기
var bodyParser = require('body-parser');
var static = require('serve-static');
var app = express();

app.set('port',process.env.PORT||3000);

//bodyparser사용하여 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({extended:false}));

//application/json 파싱
app.use(bodyParser.json());

//특정 폴더의 파일들을 특정 패스로 접근할수있도록 만든다.
//path와 public을 합친다 경로 셋팅
//public 안에 있는 파일을 곧바로 쓸수 있다
//app.use(static(path.join(__dirname,'public')));
app.use('/public', static(path.join(__dirname, 'public')));

app.use(cookieParser());
app.use(expressSession({
    secret:'my key',
    resave:true,
    saveUninitialized:true
}));


router.route('/process/product').get(function(req,res){
    console.log("/process/product 처리");

    if(req.session.user){
        res.redirect('/public/product.html');
    }else{
        res.redirect('/public/loginForm_01.html');
    }
})

router.route('/process/login').post(function(req,res){
    console.log("/process/login 처리");

    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;

    if(req.session.user){
        //로그인 상태
        console.log("로그인 상태");
        res.redirect('/public/product.html');
    }else{
        //세션 저장
        req.session.user={
            id:paramId,
            name:'sun',
            authorized:true
        }
        res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
        res.write('<h1>Login 성공</h1>');
        res.write('<div>'+paramId+'</div>');
        res.write('<div>'+paramPassword+'</div>');
        res.write('<div><a href="/process/product">상품페이지로</a></div>');
        res.end();
    }

   
})

router.route('/process/logout').get(function(req,res){
    console.log("/process/logout 처리");

    if(req.session.user){
        console.log("로그아웃합니다");
        req.session.destroy(function(err){
            if(err)throw err;

            console.log("세션삭제");
            res.redirect('/public/loginForm_01.html');
        })
    }else{
        console.log("로그인 상태 아님");
        res.redirect('/public/loginForm_01.html');
    }
})




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


//등록 되지 않은 패스에 대해 오류 페이지등록
/* app.all('*',function(req,res){
    res.status(404).send('<h1> ERROR 페이지를 찾을 수 없습니다.</h1>');
}) */

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