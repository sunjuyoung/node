var output = '안녕?';
var buffer1 = new Buffer(10);
var len = buffer1.write(output,'utf8');
console.log('첫 번째 버퍼의 문자: %s',buffer1.toString());

var buffer2 = new Buffer('안녕2','utf8');
console.log("두 번째 버퍼 문자",buffer2.toString());


//타입 확인
console.log(Buffer.isBuffer(buffer1), Buffer.isBuffer(buffer2));

//버퍼 객체에 들어 있는 문자열 데이터를 문자열 변수로 변환
var byteLen = Buffer.byteLength(output);
console.log(byteLen);
var str1 = buffer1.toString('utf8',0,byteLen);
var str2 = buffer2.toString('utf8');

console.log(str1);
console.log(str2);

//버퍼 객체 복사
buffer1.copy(buffer2,0,0,len);
console.log("두 번째 버퍼에 복사 : ",buffer2.toString('utf8'));

//두 개의 버퍼 붙이기
var buffer3 = Buffer.concat([buffer1,buffer2]);
console.log("버퍼 붙이기:" ,buffer3.toString());