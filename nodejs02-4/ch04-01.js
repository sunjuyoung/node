var url = require('url');


var curURL = url.parse('https://m.search.naver.com/search.naver?query=steve+jobs&where=m&sm=mtp_hty');

var curStr = url.format(curURL);

console.log(curStr);
console.log(curURL);

var querystring = require('querystring');
var param = querystring.parse(curURL.query);

console.log(param);

process.on('exit',function(){
    console.log('exit');
})

setTimeout(() => {
    console.log("2초후 종료");
    process.exit();
}, 2000);