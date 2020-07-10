/* function add(a,b,callback){
    var result = a+b;
    callback(result);
}


add(10,10,function(result){
    console.log(result);
}) */

function add1(a,b,callback){
    var result = a+b;
    callback(result);
    var count = 0;
    var history=function(){
        count++;
        return count+':'+a+'+'+b+'='+result;
    }
    return history;
}

console.log("--------");

var hi = add1(10,10,function(result){
    console.log("더하기 값 %d",result);
});

console.log("함수 실행 결과 "+hi());



function Person(name,age){
    this.name=name;
    this.age=age;
}

Person.prototype.walk=function(speed){
    console.log(speed);
}


var person01 = new Person('wef',20);

person01.walk(10);