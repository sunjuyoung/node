var fs = require('fs');

var inname= './wef.txt';
var outname = './wef2.txt';

fs.exists(outname,function(exists){
    if(exists){
        fs.unlink(outname,function(err){
            if(err)throw err;
            console.log('기존 파일 outname 삭제함',outname);
        })
    }
    var infile1 = fs.createReadStream('./wef.txt',{flags:'r'});
    var outfile1 = fs.createWriteStream('./wef2.txt',{flags:'w'});
    infile1.pipe(outfile1);
    console.log('파일 복사 : %s -> %s',inname,outname );
})