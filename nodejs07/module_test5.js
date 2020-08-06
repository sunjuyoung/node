
var user5 = require('./user5');


function showUser(){
    return user5.getUser().name+','+user5.group.name;
}

console.log(user5.group.id);
console.log(showUser());