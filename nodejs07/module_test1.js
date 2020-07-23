
var user1 = require('./user1');
var user2 = require('./user2');

function showUser(){
 
    return user2.getUser();
}

console.log(showUser());

console.dir(user2);

