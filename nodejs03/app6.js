/**
 * serve-static
 */
var express = require('express')
    ,http = require('http')
    ,path = require('path');

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
app.use(static(path.join(__dirname,'public')));

//미들웨어에서 파라미터 확인
app.use(function(req,res,next){
    console.log('첫번째 미들웨어');

    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;

    res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
    res.write('<h1>Express 응답 결과</h1>');
    res.write('<div>'+paramId+'</div>');
    res.write('<div>'+paramPassword+'</div>');
    res.end();
})

http.createServer(app).listen(app.get('port'),function(){
    console.log("3000포트");
})