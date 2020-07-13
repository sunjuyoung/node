var fs = require('fs');


fs.readFile('./package.json','utf-8',function(err,data){
    console.log("data");
})

//동기식
var data  = fs.readFileSync('./package.json','utf-8');
console.log(data);


fs.readFile('./packae.json','utf-8',function(err,data){
    if(err){
        console.log("err: "+err);
    }
})

fs.writeFile('./wef.txt','내용',function(err){
    if(err){
        console.log(err);
    }
})