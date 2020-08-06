
//로그인
var login = function(req,res){
    console.log('/process/login');

    var paramId =  req.body.id;
    var paramPassword = req.body.password;

    // 데이터베이스 객체 참조
	var database = req.app.get('database');

    if(database){
        authUser(database,paramId,paramPassword,function(err,docs){
            if(err) throw err;

            if(docs){
                console.dir(docs);
                var username= docs[0].name;
                res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>로그인 성공</h1>');
                res.write('<div>'+paramId+'</div>');
                res.write('<div>'+paramPassword+'</div>');
                res.write('<div><a href="/process/listUser">리스트</a></div>');
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

//사용자 인증 함수
var authUser = function(database,id,password,callback){
    console.log('authUser 호출됨 : ' + id + ', ' + password);
   
    //아이디를 먼저 검색
    UserModel.findById(id,function(err,result){
        if(err){
            callback(err,null);
            return;
        }

        if(result.length>0){
            console.log("아이디 찾음");


            if(result[0]._doc.password===password){
                console.log("비밀번호 일치");
                callback(null,result);
            }else{
                 console.log("비밀번호 일치하지 않음");
                 callback(null,null);
            }

          
        }else{
            console.log('일치하는 사용자를 찾ㅈ ㅣ못함');
            console.log(null,null);
        }
    })
}


//사용자 추가
var adduser = function(req,res){
    console.log('/process/addUser');

    var paramId =  req.body.id;
    var paramPassword = req.body.password;
    var paramName = req.body.name;
    var paramAge = req.body.age;

    // 데이터베이스 객체 참조
	var database = req.app.get('database');

    if(database){
        addUser(database,paramId,paramPassword,paramName,paramAge,function(err,result){
            if(err) throw err;


            if(result === 'user'){

                res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>사용자 추가 성공</h1>');
                res.write('<h1><a href="/public/loginForm_01.html">이동</a></h1>');
                res.end();

            }

        })
    }
}

//사용자 추가
var addUser = function(database,id,pw,name,age,callback){
    console.log('addUser func');

    var user = UserModel({'id':id,'password':pw,'name':name,'age':age});
    user.save(function(err){
        if(err){
            callback(err,null);
            return;
        }
        console.log("추가 완료");
        console.dir(user);
        callback(null,'user');
    })


}


//로그인
var listuser = function(req,res){
    console.log('/process/listUser');

    // 데이터베이스 객체 참조
	var database = req.app.get('database');

    if(database){
        UserModel.findAll(function(err,result){
            if(err){
                console.log("리스트 조회 에러");

                res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>리스트 조회 에러</h1>');
                res.write('<p>'+err.stack+'</p>');
                res.end();
                
                return;
            }

            if(result){ //결과 있으면 리스트 전송
                res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>리스트 조회 </h1>');
                res.write('<div><ul>');
                for(var i=0; i<result.length; i++){
                    var id_ = result[i]._doc.id;
                    var name_ = result[i]._doc.name;
                    res.write('<li>#'+i+':'+id_+','+name_+'</li>');
                }
                
                res.write('</ul></div>');
                res.end();
               

            }else{
                res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>리스트 조회 실패</h1>');
                res.end();
            }



        })
    }
}

module.exports.login = login;
module.exports.adduser = adduser;
module.exports.listuser = listuser;