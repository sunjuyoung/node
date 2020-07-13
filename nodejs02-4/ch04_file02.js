var fs = require('fs');

//파일에 데이터 쓰기

fs.open('./wef.txt','w',function(err,fd){
    if(err)throw err;

    var buf = new Buffer('안녕');
    console.log("버퍼타입 : %s ",Buffer.isBuffer(buf));
    fs.write(fd,buf,0,buf.length,null,function(err,written,buffer){
        if(err) throw err;

        console.log("err :"+err);
        console.log("err :"+written);
        console.log("err :"+buffer);

        fs.close(fd,function(){
            console.log("파일 닫기");
        })
    })

})
