const express=require('express');
const session=require('express-session');
const bodyParser=require('body-parser');
const app=express()

var mysql=require('mysql');
var con=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"1914163@Ksrct",
    database:"testdb"
});

con.connect(function (err){
    if(err) throw err;
    console.log("Connected:");
});

app.set('view engine','ejs')

app.use(bodyParser.urlencoded({extended:true}))

app.use(session({
    secret:'mysecret',
    resave:true,
    saveUninitialized:true
}))

app.get('/',(req,res)=>{
    res.render('index');
})

app.get('/register',(req,res)=>{
    res.render('register');
})

app.get('/page1',(req,res)=>{
    res.render('page1',{
        username:req.query.name,
        userdept:req.query.dept
    });
})

app.get('/page2/:name/:dept',(req,res)=>{
    res.render('page2',{
        username:req.params.name,
        userdept:req.params.dept,
    });
})

app.get('/page2',(req,res)=>{
    res.render('page2',{
        session:req.session
    });
})

app.get('/page3',(req,res)=>{
    res.render('page3',{
        session:req.session
    })
})

app.post('/userauth',(req,res)=>{
    var username=req.body.username;
    var password=req.body.password;
    con.query('SELECT studentname FROM student WHERE username=? AND password=?',[username,password],function(err,result,fields){
        if(result.length>0){
            req.session.studentname=result[0].studentname;
            res.redirect('page3');
        }
        else{
            res.send('Login Failed');
        }
    })  
})

app.post('/registeruser',(req,res)=>{
    var studentname=req.body.studentname;
    var username=req.body.username;
    var password=req.body.password;
    con.query('INSERT INTO student(studentname,username,password) VALUES (?,?,?)',[studentname,username,password],function(err,result,fields){
        if(result.affectedRows>0){
            res.redirect('/');
        }
        else{
            res.send('Registration Failed');
        }
    })  
})
app.listen(8080);