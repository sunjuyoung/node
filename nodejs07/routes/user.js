var pool = require('../database/database');
console.log(pool);

//로그인
var login = function(req,res){
    console.log('/process/login');

    var paramId =  req.body.id;
    var paramPassword = req.body.password;

    if(pool){
        authUser(paramId,paramPassword,function(err,result){
            if(err) throw err;

            if(result){
                console.dir(result);
                var username= result[0].name;
                res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>로그인 성공</h1>');
                res.write('<div>'+paramId+'</div>');
                res.write('<div>'+paramPassword+'</div>');
                res.write('<div>'+username+'</div>');
                res.end();

            }else{
                res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>로그인 실패</h1>');
                res.write('<h1>일치하는 사용자 없음</h1>');
                res.end();
            }
        })
    }else{
        res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
        res.write('<h1>데이터베이스 연결 실패</h1>');
        res.end();
    }
}

//사용자 추가
var adduser = function(req,res){
    console.log('/process/addUser');

    var paramId =  req.body.id;
    var paramPassword = req.body.password;
    var paramName = req.body.name;
    var paramAge = req.body.age;

    if(pool){
        addUser(paramId,paramPassword,paramName,paramAge,function(err,result){
            if(err) throw err;

            if(result){
                console.dir(result);
                var insertId = result.insertId;

                res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>사용자 추가 성공 : '+ insertId+'</h1>');
                res.write('<h1><a href="/public/loginForm_01.html">이동</a></h1>');
                res.end();

            }else{
                res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>사용자 추가 실패 </h1>');
                res.write('<h1><a href="/public/loginForm_01.html">이동</a></h1>');
                res.end();
            }

        })
    }
}


//사용자 추가
var addUser = function(id,password,name,age,callback){
    console.log('addUser 호출됨 : ' + id + ', ' + password);
   
    pool.getConnection(function(err,conn){
        if(err){
            console.log("pool에러");
            if(conn){
                conn.release(); //반드시 해제
            }
            callback(err,null);
            return;
        }
        console.log('데이터베이스 연결 : ' + conn.threadId);

        //데이터를 객체로
        var data = {id:id , name:name , age:age, password:password};

        //sql
        var exec = conn.query('insert into users set ?',data,function(err,result){
            conn.release(); //해제
            console.log('sql : ' + exec.sql);

            if(err){
                console.log('sql에러 : ' + err);
                callback(err,null);
                return;
            }

           callback(null,result);
        })

    })

}

//로그인
var authUser = function(id,pw,callback){
    console.log('authUser fnc');

    pool.getConnection(function(err,conn){
        if(err){
            if(conn){
                conn.release();
            }
            callback(err,null);
            return;
        }

        console.log(conn.threadId+'db연결');

        var col = ['id','name','age'];
        var tableName = 'users';

        //sql
        var exec = conn.query("select ?? from ?? where id = ? and password=?",[col,tableName,id,pw],function(err,rows){
            conn.release();
            console.log('실행 sql : ' +exec.sql);
            callback(null,rows);
        })
    })
}

module.exports.login = login;
module.exports.adduser = adduser;