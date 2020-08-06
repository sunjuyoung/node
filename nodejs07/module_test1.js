
var user1 = require('./user1');
var user2 = require('./user2');


function showUser(){
    return user1.getUser().name+','+user1.group.name;
}

console.log(user1.group.name);
console.log(showUser());