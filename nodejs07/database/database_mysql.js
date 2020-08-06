//mysql
var mysql = require('mysql');

//mysql 연결 설정
var pool = mysql.createPool({
    connectionLimit :3,
    host: 'nodedb.clwklshv9aej.ap-northeast-2.rds.amazonaws.com',
    user: 'admin',
    password : 'rnrdj123',
    database : 'test',
    debug : false

});

module.exports = pool;