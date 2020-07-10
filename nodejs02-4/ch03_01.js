var Person = {};

Person['age']=20;
Person['name']='소녀시대';
Person.add = function(a,b){
    return a+b;
};

var oper = function(a,b){
    return a+b;
}

Person['oper']=oper;

console.log("더하기 %d",Person.add(10,10));

console.log(Person.oper(10,10));


var Users = [{name:'러블리즈',age:20},{name:'아이즈',age:20},{name:'트와이스',age:20}];

for(var i =0; i<Users.length; i++){
    console.log(Users[i].name);
}
console.log("===================");
//Users.pop();
//Users.shift();
Users.unshift({name:'싹쓰리',age:40});
Users.forEach(function(item,index){
    console.log(item.name,index);
})

Users.splice(1,1);
console.log(Users);
console.dir(Users);