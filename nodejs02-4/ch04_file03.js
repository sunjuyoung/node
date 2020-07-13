var fs = require('fs');

//만들어진 파일 읽기

fs.open('./wef.txt','r',function(err,fd){
    if(err)throw err;

    var buf = new Buffer(10);
    console.log("버퍼",Buffer.isBuffer(buf));

    fs.read(fd,buf,0,buf.length,null,function(err,bytesRead,buffer){
        if(err)throw err;

        var isStr = buffer.toString('utf8',0,bytesRead);
        console.log("파일에서 읽은 데이터 :",isStr);

        fs.close(fd,function(){
            console.log("파일 닫음");
        })

    })
})