var http=require('http');
var fs = require('fs');

var server  = http.createServer();
var port = 3000;

server.listen(port,function(){
    console.log("웹서버 시작")
})


//클라이언트 연결 처리
server.on('connection',function(socket){
    var addr = socket.address();
    console.log("클라이언트 접속:",addr);
})

//클라이언트 요청 이벤트
server.on('request',function(req,res){
    console.log("클라이언트 요청");
    //console.dir(req);
    fs.readFile('./wef.txt',function(err,data){
        res.writeHead(200,{"Content-Type":"text/html; charset=utf-8"});
        res.write('<!DOCTYPE html>');
        res.write('<html>');
        res.write('<head>');
        res.write('</head>');
        res.write('<body>');
        res.write('<h1>hi</h1>');
        res.write('<h1>');
        res.write(data);
        res.write('</h1>');
        res.write('</body>');
        res.write('</html>');
        res.end();
    })

});

server.on('close',function(){
    console.log('서버 종료');
})