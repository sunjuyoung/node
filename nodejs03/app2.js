var express = require('express');
var http = require('http');

var app = express();

app.use(function(req,res,next){
    console.log('첫 번째 미들웨어 요청 처리');

    res.writeHead('200',{'Content-Type':'text/html;charset=utf-8'});
    res.write('<h1>Express 서버에서 응답한 결과</h1>');
    req.user='mike';  //req객체에 user속성 추가(문자열)
    next(); //다음 미들웨어로  처리 결과를 넘겨준다
});


app.use('/',function(req,res,next){
    console.log('두 번째 미들웨어');
    
    res.end('<h1>'+req.user+"는 첫번째 미들웨어</h1>");
})

http.createServer(app).listen(3000,function(){
    console.log('3000포트 열림');
})
