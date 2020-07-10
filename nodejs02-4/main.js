var os = require('os');
var path = require('path');
var calc2 = require('./calc2');

console.log(os.hostname());
console.log("cpu 정보 : ",os.cpus());
console.log(os.totalmem());
console.log(os.freemem());
console.log("=====================");
var dir = ["user","mike","doc"];
var doc = dir.join(path.sep);
console.log(doc);

var filename="C:\\Users\\mike\\notepad.exe";
var dirname=  path.dirname(filename);
console.log(dirname);

console.log("모듈 calc2.add 호출 %d",calc2.add(1,2));