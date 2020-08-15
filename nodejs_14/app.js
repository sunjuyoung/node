const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session  = require('express-session');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.set('port',process.env.PORT||3000);

app.use(morgan('dev')); //추가적인 로그, dev, combined(배포환경),common,short,tiny..
app.use('/',express.static(path.join(__dirname,'public')));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave:false,
    saveUninitialized:false,
    secret:process.env.COOKIE_SECRET,
    cookie:{
        httpOnly:true,
        secure:false,
    },
    name:'Session-cookie',

}));



app.use((req,res,next)=>{
    console.log('요청 실행');
    next();
});


app.get('/',(req,res,next)=>{
    //res.send("hello express");
    res.sendFile(path.join(__dirname,'index.html'));
    next();
},(req,res)=>{
    throw new Error("에러 처리 미들웨어");
});

app.use((err,req,res,next)=>{
    console.log(err+"에러");
    res.status(500).send(err.message);
})

app.listen(app.get('port'),()=>{
    console.log(app.get('port')+"번 포트에서 대기중");
})