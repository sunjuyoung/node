var express = require('express');
var http = require('http');

var app = express();

app.use(function(req,res,next){
    console.log('첫 번째 미들웨어 요청 처리');

   // res.send({name:'아이즈원',age:20});
   res.redirect('http://google.co.kr');
    req.user='mike';  //req객체에 user속성 추가(문자열)
   
});


app.use('/',function(req,res,next){
    console.log('두 번째 미들웨어');
   
    res.end('<h1>'+req.user+"는 첫번째 미들웨어</h1>");
   
})

http.createServer(app).listen(3000,function(){
    console.log('3000포트 열림');
})
