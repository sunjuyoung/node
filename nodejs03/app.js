var express = require('express');
var http = require('http');

//익스프레스 객체 생성
var app = express();

//기본포트 app객체에 속성설정
app.set('port',process.env.PORT||3000);

http.createServer(app).listen(app.get('port'),function(){
    console.log('익스프레스 서버 실행', app.get('port'));
})
