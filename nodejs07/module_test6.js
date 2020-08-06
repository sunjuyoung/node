/**
 * 모듈에 대해 알아보기
 * 
 * 모듈 사용 패턴
 */

// 사용 패턴 : module.exports 에 객체로부터 new 연산자로 생성된 인스턴스 객체를 할당한 후 그 인스턴스 객체의 함수 호출함

var require = function(path){
    var exports={
        getUser:function(){
            return {id:'test01',name:'하이'};
        },
        group:{id:'group01',name:'친구'}
    }

    return exports;
}

var user = require('...');

function showUser(){
    return user.getUser().name+','+user.group.name;
}

console.log(showUser());