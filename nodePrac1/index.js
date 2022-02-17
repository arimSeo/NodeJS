//백엔드 시작페이지
const express = require("express"); //express설치해서 사용가능
const app = express(); //app에 사용할 express함수 불러오기
const port = 3000;
const bodyParser =require('body-parser');
const config = require('./config/key');   //config폴더 내 key.js파일 찾아가기 변수선언

const { User } =require("./models/User");

//application/x-www-form-urlencoded 형태로 된 데이터를 분석해서 가져오기 위해
app.use(bodyParser.urlencoded({extended:true}));
//json타입으로 된 데이터를 분석해서 가져오기 위해
app.use(bodyParser.json());

const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI)
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

//get 메소드
app.get("/", (req, res) => {
  res.send("Hello World! nodemon추가해서 자동변경 업데이트 되지롱");
});

//회원가입을 위한 register route 만들기
//post 메소드
app.post('/register',(req,res)=>{  //end point: '/register' , callback function: (req,res)
  //회원가입시 필요한 정보들을 client에서 가져오면 -> DB에 넣어주기!
  
  const user =new User(req.body)  //body-parser가 이용되어 client에서 보낸 정보를 받아줌(request)

  //save하기 전에 비밀번호 암호화! 
  user.save((err,userInfo)=>{
    if(err) return res.json({sucess: false, err})
    return res.status(200).json({
      sucess:true
    })
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
