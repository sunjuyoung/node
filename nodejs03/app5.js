var express = require('express');
var http = require('http');

var app = express();

app.use(function(req,res,next){
    console.log('첫 번째 미들웨어 요청 처리');
    var name = req.query.name;
    var userAgent = req.header('User-Agent');

    res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
    res.write('<h1>Express 응답 결과</h1>');
    res.write('<div>'+name+'</div>');
    res.write('<div>'+userAgent+'</div>');
    res.end();
   
});


app.use('/',function(req,res,next){
    console.log('두 번째 미들웨어');
   
    res.end('<h1>'+req.user+"는 첫번째 미들웨어</h1>");
   
})

http.createServer(app).listen(3000,function(){
    console.log('3000포트 열림');
})
